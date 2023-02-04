import { Service, OnStart, OnInit, Dependency } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "server/network";
import { Error, Success } from "shared/errors";
import { Team } from "shared/Team";
import { Drawing } from "./scenes/Drawing";
import { DrawingEnd } from "./scenes/DrawingEnd";
import { Explain } from "./scenes/Explain";
import { Lobby } from "./scenes/Lobby";
import { Scene } from "./scenes/Scene";
import { Teams } from "./scenes/Teams";
import { Voting } from "./scenes/Voting";

@Service({})
export class GameService implements OnStart, OnInit {
	public loadedPlayers: Player[] = [];
	public PlayerLoaded: BindableEvent = new Instance("BindableEvent");
	onInit() {
		Events.playerLoaded.connect((LoadedPlayer) => {
			this.loadedPlayers.push(LoadedPlayer);
			this.PlayerLoaded.Fire(LoadedPlayer);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.loadedPlayers.remove(this.loadedPlayers.indexOf(player));
		});
	}

	onStart() {
		const currentGame = new Game();
		//Waits until a player is in to start
		this.PlayerLoaded.Event.Once((player) => {
			currentGame.startGame();
		});
	}
}

class SceneHandler {}

class Game {
	private readonly gameService = Dependency<GameService>();
	private scenes: Map<String, Scene> = new Map<String, Scene>();
	private teams: Team[] = [];

	startGame() {
		let activePlayers: Player[];

		// eslint-disable-next-line no-constant-condition
		const currentPlayers = new Lobby(Players.GetPlayers())
			.onStart()
			.andThen((guard) => {
				if (guard === Error.NOT_ENOUGH_PLAYERS) {
					error(guard);
				}
			})
			.andThen(() => {
				return new Explain(this.gameService.loadedPlayers).onStart();
			})
			.andThen((guard) => {
				if (guard !== Success.CONTINUE) {
					error(guard);
				}
			})
			.andThen(() => {
				activePlayers = this.gameService.loadedPlayers;

				print(`ACTIVATE PLAYERS IN SCENE:`);
				print(activePlayers);

				const teams = new Teams(activePlayers);
				const promise = teams.onStart();
				this.teams = teams.getTeams();

				return promise;
			})
			.andThen((guard) => {
				if (guard !== Success.CONTINUE) {
					error(guard);
				}
			})
			.andThen(() => {
				return new Drawing(this.teams).onStart();
			})
			.andThen((guard) => {
				if (guard !== Success.CONTINUE) {
					error(guard);
				}
			})
			.andThen(() => {
				return new DrawingEnd(activePlayers).onStart();
			})
			.andThen((guard) => {
				if (guard !== Success.CONTINUE) {
					error(guard);
				}
			})
			.andThenCall(Promise.delay, 5)
			.andThen(() => {
				return new Voting(activePlayers, this.teams).onStart();
			})
			.andThen((guard) => {
				if (guard !== Success.CONTINUE) {
					error(guard);
				}
			})
			.finally(() => {
				print("POINTS!!!!!!");
				this.teams.forEach((team) => {
					print(team.teamName);
					print(team.getScore());
				});
			})
			.catch((err) => {
				print(err);
				this.startGame();
				return err;
			});
	}
}

import { Events } from "server/network";
import { Error, Success } from "shared/errors";
import { Team } from "shared/Team";
import { GameService } from "../game";
import { Scene, onStart, onDestroy } from "./Scene";
import { Dependency } from "@flamework/core";
import { VOTE } from "shared/vote";

//seconds to view teams drawing & vote
const PER_TEAM_TIME = 8;

//TODO: figure something out for if a player does not vote

export class Voting extends Scene implements onStart, onDestroy {
	private readonly gameService = Dependency<GameService>();
	private teams: Team[] = [];
	private votedPlayers: Player[] = [];
	constructor(activePlayers: Player[], teams: Team[]) {
		super(activePlayers);
		this.teams = teams;
	}

	onStart(): Promise<Error | Success> {
		print("VOTING SCENE WOULD GO HERE!");

		//enables the voting screen gui
		Events.startVoting.fire(super.getScenePlayers());

		// team that the sendvote event will send votes to
		let currentVotingTeam: Team | undefined = undefined;

		this.maid.GiveTask(
			Events.sendVote.connect((player, vote: string) => {
				//make sure player is eligible to vote
				print("TESTING VOTE ELIGIBILITY ");
				print("player is in scene: " + super.getScenePlayers().includes(player));
				print("player is on team: " + currentVotingTeam?.hasPlayer(player));
				print("player has already voted: " + this.votedPlayers.includes(player));

				if (
					!super.getScenePlayers().includes(player) || // > player is not in the scene
					currentVotingTeam?.hasPlayer(player) || // > player is on the team
					this.votedPlayers.includes(player) // > player has already voted
					//                                   *** then don't let them vote***
				) {
					return;
				}
				this.votedPlayers.push(player);

				currentVotingTeam?.addScoreFromVote(vote as VOTE);

				print("RECEIVED VOTE: " + vote + " ADDED TO TEAM: " + currentVotingTeam?.teamName);
			}),
		);

		this.teams.forEach((team) => {
			print(team.getPreviousDrawings());
			//send the drawings to the players

			Events.displayVoting.fire(this.gameService.loadedPlayers, team.getPreviousDrawings(), team.getPlayers());

			currentVotingTeam = team;
			this.votedPlayers.clear();

			task.wait(PER_TEAM_TIME);
		});

		Events.cleanupVoting.fire(this.gameService.loadedPlayers);

		return Promise.resolve(Success.CONTINUE);
	}

	onDestroy(): Promise<Error | Success> {
		this.maid.Destroy();

		return Promise.resolve(Success.CONTINUE);
	}
}

import { t } from "@rbxts/t";
import { Events } from "server/network";
import { Coordinate } from "shared/coordinate";
import { Error, Success } from "shared/errors";
import { Team } from "shared/Team";
import { onStart, Scene } from "./Scene";

export class Drawing extends Scene implements onStart {
	private teams: Team[];
	constructor(teams: Team[]) {
		super([]);

		this.teams = teams;
	}

	/**
	 * verifies that passed `drawing` is an array of LuaTuple<Vector2, Vector2>
	 * @param drawing
	 * @returns boolean: isDrawing
	 */
	private isDrawing(drawing: unknown): drawing is Array<LuaTuple<[Vector2, Vector2]>> {
		const check = drawing as Array<LuaTuple<[Vector2, Vector2]>>;

		for (const tuple of check) {
			if (t.Vector2(tuple[0]) && t.Vector2(tuple[1])) {
				continue;
			} else {
				return false;
			}
		}

		return true;
	}

	/**
	 * Starts spectating for all players in team aside from the `except` (probably the person drawing)
	 * @param team
	 * @param except Player who is not spectating
	 */
	private startSpectating(team: Team, except: Player) {
		const spectating = team.getPlayers();
		spectating.remove(spectating.indexOf(except));

		Events.startSpectating.fire(spectating);
	}

	onStart(): Promise<Error | Success> {
		const verifiedDrawings = new Map<Player, Array<LuaTuple<[Vector2, Vector2]>>>();

		this.maid.GiveTask(
			Events.sendDrawing.connect((player, drawing) => {
				if (!this.isDrawing(drawing)) {
					warn(`${player} sent invalid array drawing!`);
					print(drawing);
					return;
				}

				if (verifiedDrawings.has(player)) {
					warn(`${player} sent a drawing but there is already a verified drawing!`);
					return;
				}

				verifiedDrawings.set(player, drawing);

				//Events.sendTestDrawing.broadcast(drawing);
			}),
		);

		this.maid.GiveTask(
			Events.sendSpectatorUpdate.connect((player: Player, drawing) => {
				if (!this.isDrawing(drawing)) {
					warn(`${player} sent invalid array drawing for spectator update!`);
					print(drawing);
					return;
				}

				print("received spectator update!");

				const team = Team.getTeamFromPlayer(this.teams, player);

				if (team !== undefined) {
					Events.sendSpectateDrawing.fire(team.getPlayers(), drawing);
					print("sent spectator update!");
				}
			}),
		);

		//TODO: STOP REUSING THE SAME START SPECTATING CODE! IT'S IDENTICAL!
		this.teams.forEach((team) => {
			//2 players = 30 seconds each; 3 players = 20 seconds each
			const drawingtime = 60 / team.getPlayers().size();

			const drawPromise = Promise.try(() => {
				//begin leader drawing
				Events.startDrawing.fire(team.leader, drawingtime);

				//leader is the `except` (does not spectate because they are drawing)
				this.startSpectating(team, team.leader);
			})
				.andThenCall(Promise.delay, drawingtime)
				.andThen(() => {
					//cleanup spectate
					Events.cleanupSpectating.fire(team.getPlayers());
				})
				.andThen(() => {
					//begin partner drawing
					Events.startDrawing.fire(team.partner, drawingtime);

					//partner1 is the `except` (does not spectate because they are drawing)
					this.startSpectating(team, team.partner);
				})
				.andThenCall(Promise.delay, drawingtime)
				.andThen(() => {
					//cleanup spectate
					Events.cleanupSpectating.fire(team.getPlayers());
				})
				.finally(() => {
					if (team.partner2 !== undefined) {
						Events.startDrawing.fire(team.partner2, drawingtime);

						//partner2 is the `except` (does not spectate because they are drawing)
						this.startSpectating(team, team.partner2);
					} else {
						drawPromise.cancel();
					}
				});
		});

		return Promise.resolve(Success.CONTINUE);
	}
}

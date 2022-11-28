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

	onStart(): Promise<Error | Success> {
		print("EXPLANATION SCENE WOULD GO HERE!");

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

				print(drawing);
				verifiedDrawings.set(player, drawing);

				Events.sendTestDrawing.broadcast(drawing);
			}),
		);

		this.teams.forEach((team) => {
			Promise.try(() => {
				Events.startDrawing.fire(team.leader);
			});
		});

		return Promise.resolve(Success.CONTINUE);
	}
}

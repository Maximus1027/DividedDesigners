import { Players } from "@rbxts/services";
import { Events } from "server/network";
import { Error, Success } from "shared/errors";
import { Team } from "shared/Team";
import { onStart, Scene } from "./Scene";

export class Teams extends Scene implements onStart {
	private finalTeams: Team[] = [];

	public getTeams(): Team[] {
		return this.finalTeams;
	}

	onStart(): Promise<Error | Success> {
		const genTeams = this.generateTeams() as Map<string, Player[]>;
		print(genTeams);

		//teams in type `team`
		const teams: Team[] = [];

		genTeams.forEach((players: Player[], teamName: string) => {
			if (players.size() > 2) {
				teams.push(new Team(teamName, players[0], players[1]));
			} else {
				teams.push(new Team(teamName, players[0], players[1], players[2]));
			}
		});

		teams.forEach((team) => {
			Events.displayTeams.fire(team.getPlayers(), team);
		});

		this.finalTeams = teams;

		//8 seconds to view their team
		task.wait(8);
		Events.cleanupTeams.broadcast();

		return Promise.resolve(Success.CONTINUE);
	}

	private generateTeams(): Map<String, Player[]> {
		const teams = new Map<String, Player[]>();

		let index = 1;
		for (let i = 1; i <= this.getScenePlayers().size(); i += 2) {
			const newTeam = [this.getScenePlayers()[i], this.getScenePlayers()[i - 1]];
			teams.set(`TEAM_${index}`, newTeam);
			if (this.getScenePlayers().size() % 2 !== 0) {
				if (i - 1 === this.getScenePlayers().size()) {
					(teams.get(`TEAM_${index}`) as Player[])?.push(
						this.getScenePlayers()[this.getScenePlayers().size() - 1] as Player,
					);
				}
			}

			index++;
		}

		return teams;
	}
}

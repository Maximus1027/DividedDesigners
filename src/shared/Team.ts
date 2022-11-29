export class Team {
	teamName: String;
	leader: Player;
	partner: Player;
	partner2?: Player;
	constructor(teamName: String, leader: Player, partner: Player, partner2?: Player) {
		this.partner = partner;
		this.leader = leader;
		this.teamName = teamName;
		if (partner2 !== undefined) {
			this.partner2 = partner2;
		}
	}

	public getPlayers(): Player[] {
		if (this.partner2 !== undefined) {
			return [this.leader, this.partner, this.partner2];
		} else {
			return [this.leader, this.partner];
		}
	}

	public hasPlayer(player: Player): boolean {
		return this.getPlayers().indexOf(player) !== -1;
	}

	static getTeamFromPlayer(teams: Team[], player: Player): Team | undefined {
		const team: Team = teams.filter((team) => team.hasPlayer(player))[0];
		if (team !== undefined) {
			return team;
		}

		return undefined;
	}
}

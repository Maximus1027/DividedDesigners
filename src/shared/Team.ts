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
}

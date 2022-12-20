export class Team {
	teamName: String;
	leader: Player;
	partner: Player;
	partner2?: Player;
	previousDrawings?: LuaTuple<[Vector2, Vector2]>[][];
	constructor(teamName: String, leader: Player, partner: Player, partner2?: Player) {
		this.partner = partner;
		this.leader = leader;
		this.teamName = teamName;
		if (partner2 !== undefined) {
			this.partner2 = partner2;
		}
	}

	/**
	 * Add drawing to the team's previousDrawings base
	 * @param drawing
	 */
	public addDrawing(drawing: LuaTuple<[Vector2, Vector2]>[]) {
		if (this.previousDrawings === undefined) {
			this.previousDrawings = [];
		}
		print(`adding drawing: \n${drawing} to team: ${this.teamName}`);
		this.previousDrawings.push(drawing);
	}

	/**
	 * Retrieves the previous team drawings
	 * @returns LuaTuple<[Vector2, Vector2]>[][] Array of drawings or undefined
	 */
	public getPreviousDrawings(): LuaTuple<[Vector2, Vector2]>[][] | undefined {
		return this.previousDrawings;
	}

	/**
	 * Get all players on team
	 * @returns Player[]
	 */
	public getPlayers(): Player[] {
		if (this.partner2 !== undefined) {
			return [this.leader, this.partner, this.partner2];
		} else {
			return [this.leader, this.partner];
		}
	}

	/**
	 * Checks if the team has a certain player
	 * @param player
	 * @returns boolean if the team contained player
	 */
	public hasPlayer(player: Player): boolean {
		return this.getPlayers().indexOf(player) !== -1;
	}

	/**
	 * Utily function to return the team with a certain player
	 * @param teams
	 * @param player
	 * @returns Team | undefined if no team was found
	 */
	static getTeamFromPlayer(teams: Team[], player: Player): Team | undefined {
		const team: Team = teams.filter((team) => team.hasPlayer(player))[0];
		if (team !== undefined) {
			return team;
		}

		return undefined;
	}
}

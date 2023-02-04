import { VOTE } from "./vote";

export class Team {
	teamName: String;
	leader: Player;
	partner: Player;
	partner2?: Player;
	previousDrawings?: LuaTuple<[Vector2, Vector2]>[][];

	score = 0;
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
	 * Adds the corresponding score to the team based on the vote
	 * @param vote the vote to add
	 */
	public addScoreFromVote(vote: VOTE): void {
		switch (vote) {
			case VOTE.BAD:
				this.score += 1;
				break;
			case VOTE.OK:
				this.score += 2;
				break;
			case VOTE.GOOD:
				this.score += 3;
				break;
			case VOTE.GREAT:
				this.score += 4;
				break;
		}
	}

	/**
	 * Adds score to the team
	 * @param score the score number to add
	 */
	public addScore(score: number) {
		this.score += score;
	}

	/**
	 *
	 * @returns number: the team's score
	 */
	public getScore(): number {
		return this.score;
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

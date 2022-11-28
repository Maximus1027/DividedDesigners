//abstract class that is the base for all scenes

import Maid from "@rbxts/maid";
import { Error, Success } from "shared/errors";

export interface onStart {
	/**
	 * Called when the scene is started
	 *
	 * @hideinherited
	 */
	onStart(): Promise<Error | Success>;
}

export interface onDestroy {
	/**
	 * Called when the scene is destroyed
	 *
	 * @hideinherited
	 */
	onDestroy(): void;
}

export interface onPlayerAdded {
	/**
	 * Called when a player is added to the scene
	 *
	 * @hideinherited
	 */
	onPlayerAdded(player: Player): void;
}

export interface onPlayerLeft {
	/**
	 * Called when a player is removed from the scene
	 *
	 * @hideinherited
	 */
	onPlayerLeft(player: Player): void;
}

//each scene is a different stage of the game
export abstract class Scene {
	public maid = new Maid();

	//absract constructor
	private players: Player[];
	constructor(players: Player[]) {
		this.players = players;
	}

	public getScenePlayers() {
		return this.players;
	}

	// public abstract onStart(): void;
	// public abstract onPlayerAddedToTeam(): void;
	// public abstract onPlayerRemovingFromTeam(): void;
	// public abstract onTeamCreated(): void;
	// public abstract onTeamDestroyed(): void;
	// public abstract onTeamPlayerAdded(): void;
	// public abstract onTeamPlayerRemoved(): void;
	// public abstract onTeamChanged(): void;
	// public abstract onPlayerChanged(): void;
	// public abstract onPlayerChatted(): void;
	// public abstract onPlayerDescendantAdded(): void;
	// public abstract onPlayerDescendantRemoving(): void;
	// public abstract onPlayerAddedToTeam(): void;
}

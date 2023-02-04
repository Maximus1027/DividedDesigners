import { Events } from "server/network";
import { Error, Success } from "shared/errors";
import { onStart, Scene } from "./Scene";
import { GameService } from "../game";
import { Dependency } from "@flamework/core";

export class DrawingEnd extends Scene implements onStart {
	private readonly gameService = Dependency<GameService>();
	onStart(): Promise<Error | Success> {
		//Sends the timesup screen to all players
		Events.timesUp.fire(this.gameService.loadedPlayers);
		print("Times up!");

		return Promise.resolve(Success.CONTINUE);
	}
}

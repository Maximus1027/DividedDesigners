import { Players } from "@rbxts/services";
import { Events } from "server/network";
import { Error, Success } from "shared/errors";
import { GameService } from "../game";
import { onDestroy, onStart, Scene } from "./Scene";
import { Dependency } from "@flamework/core";

export class Lobby extends Scene implements onStart, onDestroy {
	private readonly gameService = Dependency<GameService>();
	onStart(): Promise<Error | Success> {
		print("Lobby started");
		//	Events.displayLobby.broadcast();
		this.gameService.loadedPlayers.forEach((player: Player) => {
			Events.displayLobby.fire(player);
		});
		this.maid.GiveTask(
			this.gameService.PlayerLoaded.Event.Connect((newJoined) => {
				Events.displayLobby.fire(newJoined);
			}),
		);

		while (true) {
			task.wait(1);
			if (Players.GetPlayers().size() >= 2) {
				//	return Promise.resolve(Success.CONTINUE);
				break;
			} else {
				print("Waiting for players!");
			}
		}

		for (let i = 10; i > 0; i--) {
			task.wait(1);
			print(`Starting in ${i} seconds`);
		}

		Events.cleanupLobby.broadcast();

		return Promise.resolve(Success.CONTINUE);
	}

	onDestroy(): void {
		this.maid.Destroy();
	}
}

import { Controller, OnStart, OnInit } from "@flamework/core";
import { Events } from "client/network";

/**
 * This controller handles waitng for player to load in, lets the server know too
 */
@Controller({})
export class LoadHandler implements OnStart, OnInit {
	onInit() {
		if (!game.IsLoaded()) {
			game.Loaded.Wait();
		}

		Events.playerLoaded.fire();
	}

	onStart() {}
}

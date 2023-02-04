import { Controller, OnInit, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/network";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;

const timesUp = playerGui?.WaitForChild("TimesUp") as ScreenGui;

@Controller({})
export class DrawingEnd implements OnStart, OnInit {
	onInit() {
		Events.timesUp.connect(() => {
			timesUp.Enabled = true;

			task.wait(5);

			timesUp.Enabled = false;
		});
	}

	onStart() {}
}

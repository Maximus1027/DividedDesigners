import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, RunService, UserInputService } from "@rbxts/services";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;

const backdrop = playerGui?.WaitForChild("Main")?.WaitForChild("backdrop") as ImageLabel;

@Controller({})
export class UIDefaults implements OnStart, OnInit {
	onInit() {}

	onStart() {
		this.movingWallpaper();
	}

	private movingWallpaper() {
		while (RunService.Heartbeat.Wait()) {
			backdrop.TweenPosition(
				new UDim2(0.5 + math.cos(tick()) / 40, 0, 0.5 + math.sin(tick()) / 40, 0),
				Enum.EasingDirection.Out,
				Enum.EasingStyle.Quad,
				0.01,
				true,
			);
		}
	}
}

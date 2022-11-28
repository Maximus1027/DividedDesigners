import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/network";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;

const LobbyDisplay = playerGui?.WaitForChild("Lobby") as ScreenGui;
const playerCount = LobbyDisplay?.WaitForChild("PlayerCount") as TextLabel;

@Controller({})
export class Lobby implements OnStart, OnInit {
	onInit() {
		Events.displayLobby.connect(() => {
			playerCount.Text = `${Players.GetPlayers().size()}/2`;
			LobbyDisplay.Enabled = true;
		});

		Events.cleanupLobby.connect(() => {
			LobbyDisplay.Enabled = false;
		});

		Players.PlayerAdded.Connect(() => {
			playerCount.Text = `${Players.GetPlayers().size()}/2`;
		});

		Players.PlayerRemoving.Connect(() => {
			playerCount.Text = `${Players.GetPlayers().size()}/2`;
		});
	}

	onStart() {}
}

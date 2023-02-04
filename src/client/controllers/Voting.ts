import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import { Team } from "shared/Team";
import { getAvailableCanvas } from "shared/utils/DrawingUtil";
import { VOTE } from "shared/vote";
import { Drawing } from "./DrawingDisplay";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;

const votingDisplay = playerGui?.WaitForChild("Voting") as ScreenGui;
const stations = votingDisplay?.WaitForChild("stations") as Frame;
const votes = votingDisplay?.WaitForChild("votes") as Frame;

@Controller({})
export class Voting implements OnStart, OnInit {
	onInit() {
		Events.startVoting.connect(() => {
			votingDisplay.Enabled = true;
			votes.Visible = false;
		});

		// Display drawing for the player to vote on
		Events.displayVoting.connect((td, members: Player[]) => {
			//Only show voting to non team members
			if (members.find((member) => member === player) === undefined) {
				votes.Visible = true;
			} else {
				votes.Visible = false;
			}

			// Hide all and clerar stations
			stations.GetChildren().forEach((station) => {
				if (station.IsA("Frame")) {
					station.Visible = false;
					Drawing.clearCanvasDrawing(station as Frame);
				}
			});

			const teamDrawings = td as LuaTuple<[Vector2, Vector2]>[][];

			teamDrawings.forEach((teamDrawing, teamIndex) => {
				const station = stations.FindFirstChild(`station${teamIndex + 1}`) as Frame;
				station.Visible = true;

				Drawing.generateDrawing(teamDrawing, station);
			});
		});

		Events.cleanupVoting.connect(() => {
			votingDisplay.Enabled = false;
		});

		// Votes are sent to the server when the player clicks on the vote button
		votes.GetChildren().forEach((vote) => {
			if (vote.IsA("ImageButton"))
				vote.MouseButton1Click.Connect(() => {
					Events.sendVote.fire(vote.Name);
					print(`Voted for ${vote.Name}! from client!`);
				});
			print(vote.Name);
		});
	}

	onStart() {}
}

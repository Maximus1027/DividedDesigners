import { Controller, OnStart, OnInit } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import { getAvailableCanvas } from "shared/utils/DrawingUtil";
import { DrawCanvas } from "./Drawing";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;

const spectateDrawGui = playerGui?.WaitForChild("SpectateDraw") as ScreenGui;
//team drawingGUI

/**
 * Handler for spectating the drawing scene
 * Handler for displaying a team's combined drawing
 */
@Controller({})
export class DrawingDisplay implements OnStart, OnInit {
	onInit() {}

	onStart() {
		//SPECTATING
		let spectating: SpectateDrawing | undefined;

		Events.startSpectating.connect((previousDrawings: unknown) => {
			print("start spectating");
			const teamDrawings = previousDrawings as LuaTuple<[Vector2, Vector2]>[][];
			spectating = new SpectateDrawing(teamDrawings);

			spectating.displayPreviousDrawings();
			spectating.onTrack();
		});

		Events.cleanupSpectating.connect(() => {
			if (spectating !== undefined) {
				spectating.destroy();
				spectating = undefined;
			}
		});
	}
}

export class Drawing {
	static generateDrawing(drawing: unknown, canvas: Frame) {
		const draw = drawing as LuaTuple<[Vector2, Vector2]>[];

		draw.forEach((tuple) => {
			const u1 = new UDim2(tuple[0].X, 0, tuple[0].Y, 0);
			const u2 = new UDim2(tuple[1].X, 0, tuple[1].Y, 0);
			DrawCanvas.DrawLine(u1, u2, canvas);

			const connectorFrame = canvas?.FindFirstChild("drawTool")?.Clone() as Frame;
			connectorFrame.Position = u1;
			//TODO: Test without the / 2, probably why the drawings have been looking weird (found this addition in the "Previous drawings" commit)
			connectorFrame.Size = new UDim2(connectorFrame.Size.X.Scale, 0, 0, DrawCanvas.DRAW_WIDTH / 2);
			connectorFrame.Name = "connector";
			connectorFrame.Parent = canvas;
		});
	}

	/**
	 * Deletes lines & connector frames from canvas
	 * @param canvas
	 */
	static clearCanvasDrawing(canvas: Frame) {
		canvas.GetChildren().forEach((child) => {
			if (child.Name !== "drawTool") {
				child.Destroy();
			}
		});
	}

	private maid: Maid;
	constructor() {
		this.maid = new Maid();
	}

	public destroy() {}
}

class SpectateDrawing {
	private maid: Maid;
	//previous team drawings!
	private previousDrawings: LuaTuple<[Vector2, Vector2]>[][];
	constructor(previousDrawings: LuaTuple<[Vector2, Vector2]>[][]) {
		this.maid = new Maid();
		this.previousDrawings = previousDrawings;
	}

	/**
	 * Begins tracking events from the server to display for the spectator
	 */
	public onTrack() {
		//find the station that is not visible meaning it can be used
		const canvas = getAvailableCanvas(spectateDrawGui);

		canvas.Visible = true;
		Drawing.clearCanvasDrawing(canvas);

		spectateDrawGui.Enabled = true;

		//spectate drawing update
		Events.sendSpectateDrawing.connect((drawing) => {
			Drawing.clearCanvasDrawing(canvas);
			Drawing.generateDrawing(drawing, canvas);
		});
	}

	/**
	 * Displays the previous drawings using the previousDrawings array
	 */
	public displayPreviousDrawings() {
		if (this.previousDrawings === undefined || this.previousDrawings.isEmpty()) {
			return;
		}
		spectateDrawGui
			?.FindFirstChild("stations")
			?.GetChildren()
			?.filter((station) => station.IsA("Frame"))
			//sort by the "station" number at the end
			?.sort((a, b) => a.Name.split("station")[1] < b.Name.split("station")[1])
			.forEach((station) => {
				const canvas = station as Frame;

				const teamDrawing = this.previousDrawings[(station.Name.split("station")[1] as unknown as number) - 1];
				print(teamDrawing);
				print(this.previousDrawings);
				if (teamDrawing === undefined) {
					return;
				}
				canvas.Visible = true;

				Drawing.generateDrawing(teamDrawing, canvas);
			});
	}

	public destroy() {
		spectateDrawGui.Enabled = false;
		this.maid.Destroy();

		//hide all stations
		spectateDrawGui
			?.FindFirstChild("stations")
			?.GetChildren()
			?.filter((station) => station.IsA("Frame"))
			?.forEach((station) => {
				(station as Frame).Visible = false;
			});
	}
}

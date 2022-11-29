import { Controller, OnStart, OnInit } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
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

		Events.startSpectating.connect(() => {
			print("start spectating");
			spectating = new SpectateDrawing();

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

class Drawing {
	static generateDrawing(drawing: unknown, canvas: Frame) {
		const draw = drawing as LuaTuple<[Vector2, Vector2]>[];

		draw.forEach((tuple) => {
			const u1 = new UDim2(tuple[0].X, 0, tuple[0].Y, 0);
			const u2 = new UDim2(tuple[1].X, 0, tuple[1].Y, 0);
			DrawCanvas.DrawLine(u1, u2, canvas);

			const connectorFrame = canvas?.FindFirstChild("drawTool")?.Clone() as Frame;
			connectorFrame.Position = u1;
			connectorFrame.Size = new UDim2(connectorFrame.Size.X.Scale, 0, 0, DrawCanvas.DRAW_WIDTH);
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
	constructor() {
		this.maid = new Maid();
	}

	/**
	 * Begins tracking events from the server to display for the spectator
	 */
	public onTrack() {
		const canvas = spectateDrawGui?.FindFirstChild("station") as Frame;
		Drawing.clearCanvasDrawing(canvas);

		spectateDrawGui.Enabled = true;

		//spectate drawing update
		Events.sendSpectateDrawing.connect((drawing) => {
			Drawing.clearCanvasDrawing(canvas);
			Drawing.generateDrawing(drawing, canvas);
		});
	}

	public destroy() {
		spectateDrawGui.Enabled = false;
		this.maid.Destroy();
	}
}

import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import { DrawCanvas } from "./Drawing";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;
const testDrawGui = playerGui?.WaitForChild("TestDraw") as ScreenGui;

@Controller({})
export class TestDrawing implements OnStart, OnInit {
	onInit() {}

	onStart() {
		Events.sendTestDrawing.connect((drawing) => {
			print("RECEIVED", drawing);
			testDrawGui.Enabled = true;
			task.wait(1);

			const draw = drawing as LuaTuple<[Vector2, Vector2]>[];
			const canvas = testDrawGui?.FindFirstChild("station") as Frame;

			draw.forEach((tuple) => {
				print(tuple);
				const u1 = new UDim2(tuple[0].X, 0, tuple[0].Y, 0);
				const u2 = new UDim2(tuple[1].X, 0, tuple[1].Y, 0);
				DrawCanvas.DrawLine(u1, u2, canvas);

				const connectorFrame = canvas?.FindFirstChild("drawTool")?.Clone() as Frame;
				connectorFrame.Position = u1;
				connectorFrame.Size = new UDim2(connectorFrame.Size.X.Scale, 0, 0, DrawCanvas.DRAW_WIDTH);
				connectorFrame.Parent = canvas;
			});
		});
	}
}

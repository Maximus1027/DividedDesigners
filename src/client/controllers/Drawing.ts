import { Controller, OnStart, OnInit } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { Coordinate } from "shared/coordinate";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;
const clientDrawGui = playerGui?.WaitForChild("ClientDraw") as ScreenGui;

@Controller({})
export class Drawing implements OnStart, OnInit {
	onInit() {}

	onStart() {
		Events.startDrawing.connect(() => {
			clientDrawGui.Enabled = true;
			const newDrawing = new DrawCanvas(clientDrawGui?.FindFirstChild("station") as Frame);
			newDrawing.startDrawing();

			task.wait(15);
			Events.sendDrawing.fire(newDrawing.getCanvasCoordinates());
			clientDrawGui.Enabled = false;

			//cleanup events
			newDrawing.destroy();
		});
	}
}

//just converted this from lua, what a pain in the ass lmfao
/**
 * Handles Drawing on the Canvas
 *
 * @description The Holy Grail!
 */
export class DrawCanvas {
	static DRAW_WIDTH = 10;

	/**
	 * Converts array into two-tuple
	 * @param array Array of Vector2's
	 * @returns Array of two-tuple of vector2's
	 */
	static unpack<T extends Array<Vector2>>(array: T): LuaTuple<[Vector2, Vector2]> {
		return $tuple(array[0], array[1]);
	}

	/**
	 * Converts Udim2 Offset to Scale
	 * @param udim
	 * @param parent parent of the object conversion (probably the canvas)
	 * @returns Converted udim2
	 */
	static OffsetToScale(udim: UDim2, parent: Frame): UDim2 {
		const ScaleXPos = udim.X.Offset / parent.AbsoluteSize.X + udim.X.Scale;
		const ScaleYPos = udim.Y.Offset / parent.AbsoluteSize.Y + udim.Y.Scale;
		return new UDim2(ScaleXPos, 0, ScaleYPos, 0);
	}

	/**
	 *
	 * @param x
	 * @param y
	 * @param parentFrame parent of the object conversion (probably the canvas)
	 * @returns converted x,y tuple
	 */
	static ScaleToOffset(x: number, y: number, parentFrame?: Frame): LuaTuple<[number, number]> {
		const camera = Workspace.CurrentCamera;
		const viewportSize = camera!.ViewportSize;
		if (parentFrame === undefined) {
			x *= viewportSize.X;
			y *= viewportSize.Y;
		} else {
			x *= parentFrame.AbsoluteSize.X;
			y *= parentFrame.AbsoluteSize.Y;
		}

		return $tuple(x, y);
	}

	/**
	 * Draws a line between two Udim2's
	 * @param OldUdim
	 * @param NewUdim
	 * @param canvas
	 */
	static DrawLine(OldUdim: UDim2, NewUdim: UDim2, canvas: Frame): void {
		if (OldUdim && NewUdim) {
			const stoOld = DrawCanvas.ScaleToOffset(OldUdim.X.Scale, OldUdim.Y.Scale, canvas);
			const oldPos = new Vector2(stoOld[0], stoOld[1]);

			const stoNew = DrawCanvas.ScaleToOffset(NewUdim.X.Scale, NewUdim.Y.Scale, canvas);
			const newPos = new Vector2(stoNew[0], stoNew[1]);

			const Diff = oldPos.sub(newPos);
			const Dist = Diff.Magnitude;

			const Angle = math.atan(Diff.Y / Diff.X);

			//the drawn line between points object
			const lineFrame = canvas?.FindFirstChild("drawTool")?.Clone() as Frame;

			lineFrame.Position = DrawCanvas.OffsetToScale(
				new UDim2(new UDim(0, oldPos.X - Diff.X / 2), new UDim(0, oldPos.Y - Diff.Y / 2)),
				canvas,
			);
			lineFrame.Size = new UDim2(new UDim(0, Dist), new UDim(0, DrawCanvas.DRAW_WIDTH));
			lineFrame.AnchorPoint = new Vector2(0.5, 0.5);
			lineFrame.Rotation = (Angle * 180) / math.pi;
			lineFrame.BorderSizePixel = 0;
			lineFrame.Parent = canvas;
		}
	}

	private canvas: Frame;
	private mouse: Mouse;
	private isDrawing: boolean;
	private holdingMouse: boolean;

	private maid: Maid;
	private CanvasCoordinates: Array<LuaTuple<[Vector2, Vector2]>> = []; //the drawing will be saved into a table, then sent to the server

	constructor(canvas: Frame) {
		this.mouse = player.GetMouse();
		this.canvas = canvas;
		this.isDrawing = false;
		this.holdingMouse = false;

		this.maid = new Maid();
	}

	public getCanvasCoordinates(): Array<LuaTuple<[Vector2, Vector2]>> {
		return this.CanvasCoordinates;
	}

	/**
	 * Begins tracking PC & Mobile input
	 */
	private startTracking() {
		//MOBILE TRACKING
		if (UserInputService.TouchEnabled) {
			this.maid.GiveTask(
				UserInputService.TouchMoved.Connect(() => {
					this.holdingMouse = true;
				}),
			);
			this.maid.GiveTask(
				UserInputService.TouchEnded.Connect(() => {
					this.holdingMouse = false;
				}),
			);
		} else {
			//PC TRACKING
			this.maid.GiveTask(
				UserInputService.InputBegan.Connect((input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						this.holdingMouse = true;
					}
				}),
			);

			this.maid.GiveTask(
				UserInputService.InputEnded.Connect((input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						this.holdingMouse = false;
					}
				}),
			);
		}
	}

	/**
	 * Begins tracking input and begins drawing on the canvas
	 */
	public startDrawing() {
		this.startTracking();

		let lastPosition: UDim2;
		let lastTick = tick();

		/**
		 * Basically I put this here to correct for mobile's mouse movement
		 * when they lift off the screen, and then place it down again somewhere else,
		 * the old position will make a line with the newly placed mouse.
		 * This SHOULD correct for this mobile issue (not on pc because mouse is still tracked)
		 */
		if (UserInputService.TouchEnabled) {
			this.maid.GiveTask(
				UserInputService.TouchStarted.Connect(() => {
					//not proud of the duplicate code TODO: MAKE NICER
					const x = math.abs(this.mouse.X - this.canvas.AbsolutePosition.X);
					const y = math.abs(this.mouse.Y - this.canvas.AbsolutePosition.Y);

					const mousePos = new UDim2(x / this.canvas.AbsoluteSize.X, 0, y / this.canvas.AbsoluteSize.Y, 0);
					lastPosition = mousePos;
				}),
			);
		}

		RunService.BindToRenderStep("MouseMovement", Enum.RenderPriority.Input.Value, () => {
			const tickMath = tick() - lastTick;

			const x = math.abs(this.mouse.X - this.canvas.AbsolutePosition.X);
			const y = math.abs(this.mouse.Y - this.canvas.AbsolutePosition.Y);

			const mousePos = new UDim2(x / this.canvas.AbsoluteSize.X, 0, y / this.canvas.AbsoluteSize.Y, 0);

			if (tickMath >= 0.005 && lastPosition !== mousePos) {
				lastTick = tick();

				const lastPos = lastPosition;
				const pos = mousePos;

				lastPosition = mousePos;
				if (this.holdingMouse) {
					lastPosition = mousePos;

					//Checks if the mouse is on the canvas
					if (
						playerGui
							.GetGuiObjectsAtPosition(this.mouse.X, this.mouse.Y)
							.find((object) => object === this.canvas) === undefined
					) {
						return;
					}

					DrawCanvas.DrawLine(lastPos, pos, this.canvas);

					print("DRAW |--| ", lastPos.X.Scale, lastPos.Y.Scale);
					const coord = [
						new Vector2(lastPos.X.Scale, lastPos.Y.Scale),
						new Vector2(pos.X.Scale, pos.Y.Scale),
					];
					this.CanvasCoordinates.push(DrawCanvas.unpack(coord));

					const connectorFrame = this.canvas?.FindFirstChild("drawTool")?.Clone() as Frame;
					connectorFrame.Position = mousePos;
					connectorFrame.Size = new UDim2(connectorFrame.Size.X.Scale, 0, 0, DrawCanvas.DRAW_WIDTH);
					connectorFrame.Parent = this.canvas;
				}
			}
		});
	}

	/**
	 * Cleans up any events
	 */
	destroy() {
		this.maid.Destroy();
		RunService.UnbindFromRenderStep("MouseMovement");
	}
}

/**
 * Retrieves an available canvas to be used for drawing/spectating
 * @returns The first available canvas
 * @param drawScreenGui The ScreenGui to search for available canvases
 */
export function getAvailableCanvas(drawScreenGui: ScreenGui): Frame {
	const canvas = drawScreenGui
		?.FindFirstChild("stations")
		?.GetChildren()
		?.filter((station) => station.IsA("Frame"))
		?.sort((a, b) => a.Name.split("station")[1] < b.Name.split("station")[1])
		.find((station) => {
			return station.IsA("Frame") && !station.Visible;
		}) as Frame;

	return canvas;
}

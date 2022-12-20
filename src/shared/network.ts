import { Networking } from "@flamework/networking";
import { Team } from "./Team";

interface ServerEvents {
	playerLoaded(): void;

	sendDrawing(drawing: unknown): void;
	sendSpectatorUpdate(drawing: unknown): void;
}

interface ClientEvents {
	displayLobby(): void;
	cleanupLobby(): void;

	displayTeams(team: unknown): void;
	cleanupTeams(): void;

	startDrawing(time: number, previousDrawings: unknown): void;
	cleanupDrawing(): void;

	startSpectating(previousDrawings: unknown): void;
	sendSpectateDrawing(drawing: unknown): void;
	cleanupSpectating(): void;

	sendTestDrawing(drawing: unknown): void;
}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();

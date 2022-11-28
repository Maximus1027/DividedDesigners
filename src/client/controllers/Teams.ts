import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import { Team } from "shared/Team";

const player = Players.LocalPlayer;
const playerGui = player?.WaitForChild("PlayerGui") as PlayerGui;

const TeamDisplay = playerGui?.WaitForChild("TeamDisplay") as ScreenGui;

interface charList extends Instance {
	character1: ImageLabel;
	character2: ImageLabel;
	character3: ImageLabel;
}

const characterList = TeamDisplay?.WaitForChild("main") as charList;

@Controller({})
export class Teams implements OnStart, OnInit {
	onInit() {}

	onStart() {
		Events.displayTeams.connect((team) => {
			//type casted team
			const OTeam = team as Team;
			characterList.character1.Image = Players.GetUserThumbnailAsync(
				OTeam.leader.UserId,
				Enum.ThumbnailType.AvatarBust,
				Enum.ThumbnailSize.Size100x100,
			)[0];
			characterList.character2.Image = Players.GetUserThumbnailAsync(
				OTeam.partner.UserId,
				Enum.ThumbnailType.AvatarBust,
				Enum.ThumbnailSize.Size100x100,
			)[0];
			if (OTeam.partner2 !== undefined) {
				characterList.character3.Image = Players.GetUserThumbnailAsync(
					OTeam.partner2.UserId,
					Enum.ThumbnailType.AvatarBust,
					Enum.ThumbnailSize.Size100x100,
				)[0];
				characterList.character3.Visible = true;
			} else {
				characterList.character3.Visible = false;
			}

			TeamDisplay.Enabled = true;
		});

		Events.cleanupTeams.connect(() => {
			TeamDisplay.Enabled = false;
		});
	}
}

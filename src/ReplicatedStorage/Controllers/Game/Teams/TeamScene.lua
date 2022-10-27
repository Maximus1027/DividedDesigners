local Players = game:GetService("Players")
local TeamScene = {}
TeamScene.__index = TeamScene

local player: Player = Players.LocalPlayer

local labelIcons = {
    ["leader"] = "rbxassetid://11388815788",
    ["partner"] = "rbxassetid://11389050265"
}

function TeamScene.new()
	local self = setmetatable({}, TeamScene)
	self.team = {
		["leader"] = nil,
		["partner"] = {}, --usually 1 player but sometiems there'll be two
	}
	return self
end

function TeamScene:SetLeader(plr: Player)
	self.team.leader = plr
end

function TeamScene:AddPartner(plr: Player)
	table.insert(self.team.partner, plr)
end

function TeamScene:AddPartners(...: Player)
    if typeof(...) ~= "table" then --only 1 partner so NOT table
        self:AddPartner(...)
        return
    end
	for _, partner in ... do
		self:AddPartner(partner)
	end
end

function TeamScene:DisplayTeam()
	local teamGUI = player.PlayerGui:WaitForChild("TeamDisplay")

	local chars = teamGUI.main
	chars.character1.Image = Players:GetUserThumbnailAsync(
		self.team.leader.UserId,
		Enum.ThumbnailType.AvatarBust,
		Enum.ThumbnailSize.Size100x100
	)
	if #self.team.partner > 1 then --more than 1 partner
		chars.character2.Image = Players:GetUserThumbnailAsync(
			self.team.partner[1].UserId,
			Enum.ThumbnailType.AvatarBust,
			Enum.ThumbnailSize.Size100x100
		)
		chars.character3.Image = Players:GetUserThumbnailAsync(
			self.team.partner[2].UserId,
			Enum.ThumbnailType.AvatarBust,
			Enum.ThumbnailSize.Size100x100
		)

        chars.character2.Visible = true
        chars.character3.Visible = true
	else --normal player amount
		chars.character2.Image = Players:GetUserThumbnailAsync(
			self.team.partner[1].UserId,
			Enum.ThumbnailType.AvatarBust,
			Enum.ThumbnailSize.Size100x100
		)

        chars.character2.Visible = true
        chars.character3.Visible = false
	end

    chars.character1.Image = labelIcons.leader
    chars.character2.Image = labelIcons.partner
    chars.character3.Image = labelIcons.partner
end

function TeamScene:Destroy() 
    self = nil
end

return TeamScene

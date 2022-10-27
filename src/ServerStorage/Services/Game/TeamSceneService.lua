local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local TeamSceneService = Knit.CreateService({
	Name = "TeamSceneService",
	Client = {
		StartTeamScene = Knit.CreateSignal(),
		Cleanup = Knit.CreateSignal(),
	},
})

-- --Tell players it's team scene
-- function TeamSceneService:ContactPlayers()
--     self.Client.StartTeamScene:FireAll()
-- end

--start player team scene
function TeamSceneService:ContactPlayer(player: Player, team) --{leader, partner(s)}
	if #team > 2 then -- 2 partners
		self.Client.StartTeamScene:Fire(player, team[1], team[2], team[3])
	else -- 1 partner and 1 leader (2players)
        self.Client.StartTeamScene:Fire(player, team[1], team[2])
	end
end

function TeamSceneService:Cleanup()
	self.Client.Cleanup:FireAll()
end

function TeamSceneService:KnitStart() end

function TeamSceneService:KnitInit() end

return TeamSceneService

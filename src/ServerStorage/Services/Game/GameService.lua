local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local GameService = Knit.CreateService {
    Name = "GameService",
    Client = {},
}


function GameService:KnitStart()
    print("lobby scene began")
    self.LobbyScene:StartLobbyScene()
end


function GameService:KnitInit()
    local LobbyScene = Knit.GetService("LobbySceneService")
    self.LobbyScene = LobbyScene
end


return GameService

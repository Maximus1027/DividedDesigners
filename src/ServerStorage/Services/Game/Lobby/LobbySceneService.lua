local Players = game:GetService("Players")
local ProximityPromptService = game:GetService("ProximityPromptService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local LobbySceneService = Knit.CreateService {
    Name = "LobbySceneService",
    Client = {
        Cleanup = Knit.CreateSignal(),
        StartLobbyScene = Knit.CreateSignal()
    },
    isLobbyScene = false
}

local SETTINGS = require(ReplicatedStorage.src.Settings.Settings)

local playerRequirement = SETTINGS.LOBBY_PLAYERS_TO_START

--Tell players it's lobby scene
function LobbySceneService:ContactPlayers()
    self.Client.StartLobbyScene:FireAll()
end

--start player lobby scene
function LobbySceneService:ContactPlayer(player: Player)
    self.Client.StartLobbyScene:Fire(player)
end

function LobbySceneService:Cleanup()
    self.Client.Cleanup:FireAll()
end

function LobbySceneService:KnitStart()
    -- Players.PlayerAdded:Connect(function(player)
    --     if not self.isLobbyScene then
    --         return
    --     end
        
    --     if #Players:GetPlayers() >= playerRequirement then
    --         -- delete lobby scene player images and disable the screengui
    --         self.Client.Cleanup:FireAll()
    --     else
    --         self.Client.StartLobbyScene:Fire(player)
    --     end
    -- end)
end


function LobbySceneService:KnitInit()
    
end


return LobbySceneService

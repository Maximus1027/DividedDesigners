local Players = game:GetService("Players")
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

function LobbySceneService:StartLobbyScene()
    self.isLobbyScene = true
    self.Client.StartLobbyScene:FireAll()
end

function LobbySceneService:KnitStart()
    Players.PlayerAdded:Connect(function(player)
        if not self.isLobbyScene then
            return
        end
        
        if #Players:GetPlayers() >= playerRequirement then
            -- delete lobby scene player images and disable the screengui
            self.Client.Cleanup:FireAll()
        else
            self.Client.StartLobbyScene:Fire(player)
        end
    end)
end


function LobbySceneService:KnitInit()
    
end


return LobbySceneService

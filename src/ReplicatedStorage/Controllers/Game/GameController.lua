local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local GameController = Knit.CreateController { Name = "GameController" }

local plr = Players.LocalPlayer
local LobbyScreenGUI = plr.PlayerGui:WaitForChild("Lobby")

local LobbyScene = require(script.Parent.Lobby:WaitForChild("LobbyScene"))

--[[ LOBBY SCENE CODE]]--
function GameController:loadLobbyScene()
    LobbyScreenGUI.Enabled = true


    local lobbyScene = LobbyScene.new()
    :TrackPlayers(LobbyScreenGUI.players, plr.PlayerGui.templates.playerHeadLobby)
    :StartAnimation()
    self.lobbyScene = lobbyScene
end

function GameController:KnitStart()
    --[[ LOBBY SCENE CODE]]--
    self.LobbySceneService.StartLobbyScene:Connect(function()
        self:loadLobbyScene()
    end)

    self.LobbySceneService.Cleanup:Connect(function()
        if self.lobbyScene then
            self.lobbyScene:Cleanup():Destroy()
            self.lobbyScene = nil

            print("lobby scened clean")
        end
        LobbyScreenGUI.Enabled = false
    end)
end


function GameController:KnitInit()
    local LobbySceneService = Knit.GetService("LobbySceneService")
    self.LobbySceneService = LobbySceneService
end


return GameController

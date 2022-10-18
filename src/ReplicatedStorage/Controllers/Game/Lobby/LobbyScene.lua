local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LobbyScene = {}
LobbyScene.__index = LobbyScene

local SETTINGS = require(ReplicatedStorage.src.Settings.Settings)

local requiredPlayers = SETTINGS.LOBBY_PLAYERS_TO_START

function LobbyScene.new()
    local self = setmetatable({}, LobbyScene)
    return self
end

local waiting_for_players = {
    "rbxassetid://11309448386",
    "rbxassetid://11308301206",
    "rbxassetid://11308301796"
}

local lobby_background = {
    "rbxassetid://11308728004",
    "rbxassetid://11308729652",
    "rbxassetid://11308731265"
}

local plr = Players.LocalPlayer

function LobbyScene:StartAnimation()
    local LobbyScreen = plr.PlayerGui.Lobby

    local waitingPlayers = LobbyScreen.waitingplayers
    local background = LobbyScreen.background

    spawn(function()
        self.animate = true
        while self.animate do
            for i = 1,3 do
                task.wait(.13)
                waitingPlayers.Image = waiting_for_players[i]
                background.Image = lobby_background[i]
            end
            task.wait()
        end
    end)
   
end

function LobbyScene:TrackPlayers(playersFrame: Frame, playerTemplate: Frame, callback)
    self.playersFrame = playersFrame
    self.playerTemplate = playerTemplate

    if #Players:GetPlayers() >= requiredPlayers then
        if (callback) then
            callback(Players:GetPlayers()) --callback function when players hits requirement
        end
        
        return self
    end

    local function loadTemplate(player)
        local template = playerTemplate:Clone()
        template.Name = player.Name

        --thumbnail img of player
        local content, isReady = Players:GetUserThumbnailAsync(player.UserId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size100x100)
        template.head.Image = content
        template.Parent = playersFrame

        template:TweenSize(template.Size, Enum.EasingDirection.Out, Enum.EasingStyle.Elastic, 1, true)
    end
    --load players before PlayerAdded event
    for _, player in Players:GetPlayers() do
        loadTemplate(player)
    end

    self.playerAdded = Players.PlayerAdded:Connect(function(player)
        loadTemplate(player)

        if #Players:GetPlayers() >= requiredPlayers then
            if callback ~= nil then
                callback(Players:GetPlayers()) --callback function when players hits requirement
            end
            self:Destroy() -- cleanup
        end
    end)

    self.playerRemoved = Players.PlayerRemoving:Connect(function(player)
        playersFrame[player.Name]:Destroy()
    end)

    return self
end

function LobbyScene:Cleanup()
    self.animate = false

    for _, player in self.playersFrame:GetChildren() do
        if player:IsA("Frame") then
            player:Destroy()
        end
    end

    return self
end

function LobbyScene:Destroy()
    --cleanup
    if self.playerAdded and self.playersRemoved then
        self.playerAdded:Disconnect()
        self.playersRemoved:Disconnect()    
    end
    self.animate = false
    self = nil
end


return LobbyScene

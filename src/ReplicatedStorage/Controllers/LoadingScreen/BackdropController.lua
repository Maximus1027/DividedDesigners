local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")
local Knit = require(ReplicatedStorage.Packages.Knit)

local BackdropController = Knit.CreateController { Name = "BackdropController" }

local player = Players.LocalPlayer

function BackdropController:KnitStart()
    local backdrop = player.PlayerGui:WaitForChild("Main").backdrop

   -- local tween = TweenService:Create(backdrop, TweenInfo.new(10, Enum.EasingStyle.Linear), {Position = UDim2.new(1,0,0,0)})

    while true do
        task.wait(.01)

        backdrop.Position = UDim2.new(.5 + math.cos(tick())/40,0,.5 + math.sin(tick())/40,0)

      --  backdrop.Position = UDim2.new(0,0,1,0)
       -- tween:Play()
       -- tween.Completed:Wait()
    end
end


function BackdropController:KnitInit()
    
end


return BackdropController

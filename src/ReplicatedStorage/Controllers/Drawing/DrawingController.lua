game:GetService("StarterGui"):SetCoreGuiEnabled(Enum.CoreGuiType.All, false)

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local DrawingController = Knit.CreateController({ Name = "DrawingController" })

local plr = game.Players.LocalPlayer
local mouse = plr:GetMouse()

function DrawingController:KnitStart()
	local drawing = false

	local UIS = game:GetService("UserInputService")

	UIS.InputBegan:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			drawing = true
		end
	end)

	UIS.InputEnded:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			drawing = false
		end
	end)

	local frames = {}
	local canvas = plr.PlayerGui:WaitForChild("Main").station
	local draw = plr.PlayerGui.Main.station.drawTool

	mouse.Move:Connect(function()
		if drawing then
			local x = math.abs(mouse.X - canvas.AbsolutePosition.X)
			local y = math.abs(mouse.Y - canvas.AbsolutePosition.Y)

			local objects = plr.PlayerGui:GetGuiObjectsAtPosition(mouse.X, mouse.Y)
			if not table.find(objects, canvas) then
				return
			end

			local dClone = draw:Clone()

			dClone.Position = UDim2.new(x / canvas.AbsoluteSize.X, 0, y / canvas.AbsoluteSize.Y, 0)
			dClone.Parent = canvas
		end
	end)
end

function DrawingController:KnitInit() end

return DrawingController

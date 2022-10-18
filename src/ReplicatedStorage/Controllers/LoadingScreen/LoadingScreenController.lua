local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)
local Promise = require(Knit.Util.Promise)

local LoadingScreenController = Knit.CreateController({ Name = "LoadingScreenController" })

local player = Players.LocalPlayer

-- function LoadingScreenController:PlayAnimation()
-- 	local divided: ImageLabel, designers: ImageLabel, line: ImageLabel =
-- 		self.ls:WaitForChild("divided"), self.ls:WaitForChild("designers"), self.ls:WaitForChild("line")

-- 	local topFrame: Frame, bottomFrame: Frame = self.ls:WaitForChild("top"), self.ls:WaitForChild("bottom")

-- 	divided.Position = UDim2.new(-0.1, 0, 0.46, 0) -- GOAL: {0.473, 0},{0.46, 0}
-- 	designers.Position = UDim2.new(1.042, 0, 0.544, 0) -- GOAL:  {0.52, 0},{0.544, 0}
-- 	topFrame.Position = UDim2.new(0.499, 0,0.261, 0)
-- 	bottomFrame.Position = UDim2.new(0.5, 0,0.75, 0)

-- 	line.ImageTransparency = 1

-- 	print("loaded")
-- 	task.wait(1)

-- 	local tween1 =
-- 		divided:TweenPosition(UDim2.new(0.473, 0, 0.46, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 2, true)
-- 	local tween2 = 
--         designers:TweenPosition(UDim2.new(0.52, 0, 0.544, 0),Enum.EasingDirection.Out,Enum.EasingStyle.Linear,2,true)

--     task.wait(1.8)

-- 	for i = 1, 0, -0.05 do
--         task.wait(.01)
-- 		line.ImageTransparency = i
-- 	end

-- 	task.wait(.5)

-- 	for i = 0, 1, 0.05 do
--         task.wait(.014)
-- 		line.ImageTransparency = i
-- 	end


-- 	print("frames")
--     topFrame:TweenPosition(UDim2.new(0.5, 0,-0.5, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1, true)
--     bottomFrame:TweenPosition(UDim2.new(0.5, 0,1.3, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1, true)
-- 	divided:TweenPosition(UDim2.new(0.473, 0, -0.3, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1.35, true)
-- 	designers:TweenPosition(UDim2.new(0.52, 0, 1.3, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1.36, true)

-- 	return true
-- end

function LoadingScreenController:PlayAnimation()
	local divided: ImageLabel, designers: ImageLabel, line: ImageLabel =
		self.ls:WaitForChild("divided"), self.ls:WaitForChild("designers"), self.ls:WaitForChild("line")

	local topFrame: Frame, bottomFrame: Frame = self.ls:WaitForChild("top"), self.ls:WaitForChild("bottom")

	--i love promises lmfao -max

	local promise = Promise.try(function()
		divided.Position = UDim2.new(-0.1, 0, 0.46, 0) -- GOAL: {0.473, 0},{0.46, 0}
		designers.Position = UDim2.new(1.042, 0, 0.544, 0) -- GOAL:  {0.52, 0},{0.544, 0}
		topFrame.Position = UDim2.new(0.499, 0,0.261, 0)
		bottomFrame.Position = UDim2.new(0.5, 0,0.75, 0)
	
		line.ImageTransparency = 1
	end):andThenCall(Promise.delay, 1)
	:andThen(function()
		divided:TweenPosition(UDim2.new(0.473, 0, 0.46, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 2, true)
        designers:TweenPosition(UDim2.new(0.52, 0, 0.544, 0),Enum.EasingDirection.Out,Enum.EasingStyle.Linear,2,true)
	end):andThenCall(Promise.delay, 1.8)
	:andThen(function()
		for i = 1, 0, -0.05 do
			task.wait(.01)
			line.ImageTransparency = i
		end
	end):andThenCall(Promise.delay, .5):andThen(function()
		for i = 0, 1, 0.05 do
			task.wait(.014)
			line.ImageTransparency = i
		end
	
		topFrame:TweenPosition(UDim2.new(0.5, 0,-0.5, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1, true)
		bottomFrame:TweenPosition(UDim2.new(0.5, 0,1.3, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1, true)
		divided:TweenPosition(UDim2.new(0.473, 0, -0.3, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1.35, true)
		designers:TweenPosition(UDim2.new(0.52, 0, 1.3, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Linear, 1.36, true)
	end):finally(function()
		print("finished")
	end)

	return true
end

function LoadingScreenController:KnitStart() 
print("start")

    self:PlayAnimation()
end

function LoadingScreenController:KnitInit()
	local loadingScreen = player.PlayerGui:WaitForChild("LoadingScreen")
	self.ls = loadingScreen
end

return LoadingScreenController

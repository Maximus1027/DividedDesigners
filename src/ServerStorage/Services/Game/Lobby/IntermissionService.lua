local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local IntermissionService = Knit.CreateService({
	Name = "IntermissionService",
	Client = {
		Cleanup = Knit.CreateSignal(),
		StartScene = Knit.CreateSignal(),
	},
	isIntermissionScene = false,
})

function IntermissionService:ContactPlayers()
	self.Client.StartScene:FireAll()
end

function IntermissionService:KnitStart() end

function IntermissionService:KnitInit() end

return IntermissionService

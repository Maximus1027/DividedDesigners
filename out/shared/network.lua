-- Compiled with roblox-ts v2.0.2
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local createNetworkingEvent = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "networking", "out", "events", "createNetworkingEvent").createNetworkingEvent
local createNetworkingFunction = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "networking", "out", "functions", "createNetworkingFunction").createNetworkingFunction
local GlobalEvents = createNetworkingEvent("shared/network@GlobalEvents", {}, {})
local GlobalFunctions = createNetworkingFunction("shared/network@GlobalFunctions", {}, {})
return {
	GlobalEvents = GlobalEvents,
	GlobalFunctions = GlobalFunctions,
}

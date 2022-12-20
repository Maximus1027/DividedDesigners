-- Compiled with roblox-ts v2.0.2
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local createNetworkingEvent = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "networking", "out", "events", "createNetworkingEvent").createNetworkingEvent
local t = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "t", "lib", "ts").t
local createNetworkingFunction = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "networking", "out", "functions", "createNetworkingFunction").createNetworkingFunction
local GlobalEvents = createNetworkingEvent("Jw", {
	["4bda14bb-c57d-4483-9a0a-1f460eff3115"] = {},
	["2228dad6-349d-49bd-b6d1-f04f2acca9b0"] = { t.union(t.any, t.none) },
	["5c60a952-df91-492c-b69e-23c1592218f8"] = { t.union(t.any, t.none) },
}, {
	["146e07a8-d4c2-4275-8f9b-23dfc245ca8d"] = {},
	["39ad0dc3-be26-4ea5-8d3a-558fa61a2da7"] = {},
	["23e4f28d-cc52-44dd-bf4a-adecdd62de69"] = { t.union(t.any, t.none) },
	["295a8a38-0faf-4c3e-b08c-64712f544ae6"] = {},
	["e27e3e9f-148a-46e8-8abd-5b278bc3864b"] = { t.number, t.union(t.any, t.none) },
	["81d800ed-b678-46f0-bfbb-c38e345c79b6"] = {},
	["ac329936-2ee0-4599-aa8e-6255d83cdecc"] = { t.union(t.any, t.none) },
	["c77d3fb9-580a-4fba-aa8f-92d402792918"] = { t.union(t.any, t.none) },
	["9dd0e307-0349-42b9-8477-a512db2813b7"] = {},
	["53483195-6ffd-4981-ad33-d328d9041e31"] = { t.union(t.any, t.none) },
})
local GlobalFunctions = createNetworkingFunction("k4", {}, {})
return {
	GlobalEvents = GlobalEvents,
	GlobalFunctions = GlobalFunctions,
}

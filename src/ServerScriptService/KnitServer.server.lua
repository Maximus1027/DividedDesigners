local ServerStorage = game:GetService("ServerStorage")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local CompUtil = require(ReplicatedStorage.src.Utils.CompUtil)
local Knit = require(ReplicatedStorage.Packages.Knit)

--require(ServerStorage.Source.Services.MoneyService)

CompUtil.Auto(ServerStorage.src.Components)
--require(ServerStorage.Source.Components.Ki)

for _, v in pairs(ServerStorage.src:GetDescendants()) do
    if v:IsA("ModuleScript") and v.Name:match("Service$") then
        require(v)
    end
end

Knit.Start({
    ServicePromises = false,
}):andThen(function()
    print("Knit started")
end):catch(warn)



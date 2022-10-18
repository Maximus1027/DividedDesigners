local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local Promise = require(Knit.Util.Promise)

local promise = Promise.delay(2)
:andThen(function()
    print("PROMISE")
end)
:andThenCall(Promise.delay, 2)
:andThen(function()
    print("PROMISE 2")
end)
:finally(function()
    print("finally")
end)




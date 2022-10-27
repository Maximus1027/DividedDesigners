local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Knit = require(ReplicatedStorage.Packages.Knit)

local DrawSceneService = Knit.CreateService {
    Name = "DrawSceneService",
    Client = {
        StartDrawing = Knit.CreateSignal(),

    },
}

function DrawSceneService:StartDrawing(plr: Player)
    
end

function DrawSceneService:Cleanup()
    
end

function DrawSceneService:KnitStart()
    
end


function DrawSceneService:KnitInit()
    
end


return DrawSceneService

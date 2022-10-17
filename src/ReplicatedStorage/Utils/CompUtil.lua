local comp = {}

function comp.Auto(parent)
	local function Setup(moduleScript)
		local m = require(moduleScript)
		assert(type(m) == "table", "Expected table for component")
		assert(type(m.Tag) == "string", "Expected .Tag property")
		--Component.new(m.Tag)
	end
	for _,v in ipairs(parent:GetDescendants()) do
		if v:IsA("ModuleScript") then
			Setup(v)
		end
	end
	return parent.DescendantAdded:Connect(function(v)
		if v:IsA("ModuleScript") then
			Setup(v)
		end
	end)
end

return comp
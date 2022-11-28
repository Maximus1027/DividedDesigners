import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { StarterGui } from "@rbxts/services";

interface Attributes {
	property: string;
	speed: number;
	value1: string;
	value2: string;
}

@Component({
	tag: "animation",
	defaults: {
		property: "Image",
		speed: 1,
		value1: "rbxassetid://1",
		value2: "rbxassetid://2",
	},
})
export class Animation extends BaseComponent<Attributes> implements OnStart {
	onStart() {
		//check if the instance is descendant of startergui
		if (this.instance.IsDescendantOf(StarterGui)) {
			this.destroy();
		} else {
			while (true) {
				for (const [key, value] of this.instance.GetAttributes()) {
					if (key.match("^value")[0] !== undefined) {
						this.instance[this.attributes.property as never] = value as never;
						task.wait(this.attributes.speed);
					}
				}
			}
		}
	}
}

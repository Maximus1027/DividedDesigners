import { Error, Success } from "shared/errors";
import { onStart, Scene } from "./Scene";

export class Explain extends Scene implements onStart {
	onStart(): Promise<Error | Success> {
		print("EXPLANATION SCENE WOULD GO HERE!");

		return Promise.resolve(Success.CONTINUE);
	}
}

import { Actor } from "./Actor";
import { MousePressedEvent } from "./MouseEvent";
import { Scene } from "./Scene";

export class EmptyActor extends Actor {
    public setup(scene: Scene): void {
        super.setup(scene);

    }

    public update(deltaTime: number): void {
        super.update(deltaTime);

    }

    public pressed(e: MousePressedEvent): void {
    }
}
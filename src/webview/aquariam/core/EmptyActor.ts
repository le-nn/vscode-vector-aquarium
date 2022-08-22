import { Actor } from "./Actor";
import { MousePressedEvent } from "./MouseEvent";
import { Scene } from "./Scene";

export class EmptyActor extends  Actor{
    public setup(scene: Scene): void {
    }

    public update(deltaTime: number, scene: Scene): void {
    }

    public pressed(e: MousePressedEvent): void {
    }
}
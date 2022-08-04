import { Vector2D } from "./Vector2D";
import { Scene } from "./Scene";
import { MousePressedEvent } from "./MouseEvent";

export abstract class Actor {
    tags: string[] = [];
    abstract setup(scene: Scene): void;
    abstract update(deltaTime: number, scene: Scene): void;
    abstract pressed(e: MousePressedEvent): void;

    public isDestroyed = false;

    destroy() {
        this.isDestroyed = true;
    }
}
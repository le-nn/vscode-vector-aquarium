import { Vector2D } from "./Vector2D";
import { Scene } from "./Scene";
import { MousePressedEvent } from "./MouseEvent";
import { Transform } from "./Transform";

export abstract class Actor implements Transform {
    private _isDestroyed = false;

    angle = 0;
    scale = 1;
    location = new Vector2D(0, 0);
    vector: Vector2D = new Vector2D(0, 0);
    tags: string[] = [];

    get isDestroyed() {
        return this._isDestroyed;
    }

    public abstract setup(scene: Scene): void;
    public abstract update(deltaTime: number, scene: Scene): void;
    public abstract pressed(e: MousePressedEvent): void;

    public setAngle(angle: number): void {
        this.angle = angle;
    }

    public setScale(scale: number) {
        this.scale = scale;
    }

    public setLocation(location: Vector2D) {
        this.location.x = location.x;
        this.location.y = location.y;
    }

    public translateFromVector(vector: Vector2D) {
        this.vector = vector;
        this.location.x += vector.x;
        this.location.y += vector.y;
    }

    public destroy() {
        this._isDestroyed = true;
    }
}
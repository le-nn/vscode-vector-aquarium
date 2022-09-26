import { Vector2D } from "./Vector2D";
import { Scene } from "./Scene";
import { MousePressedEvent } from "./MouseEvent";
import { Actor } from "./Actor";
import { Shape } from "../shapes/Shape";
import { Transform } from "./Transform";

export class DrawableActor<TShape extends Shape = Shape> extends Actor {

    constructor(readonly shape: TShape, transform?: Partial<Transform>) {
        super();

        this.scale = transform?.scale ?? this.scale;
        this.location = transform?.location ?? this.location;
        this.angle = transform?.angle ?? this.angle;
    }

    setup(scene: Scene): void {

    }

    update(deltaTime: number, scene: Scene): void {
        this.shape.draw(
            this.location.x,
            this.location.y,
            this.angle,
            this.scale,
            deltaTime,
            scene
        );
    }

    pressed(e: MousePressedEvent): void {

    }
}
import { Actor } from "./core/Actor";
import { Color } from "./core/Color";
import { MousePressedEvent } from "./core/MouseEvent";
import { Random } from "./core/Random";
import { Scene } from "./core/Scene";
import { Vector2D } from "./core/Vector2D";
import { IRenderer } from "./core/IRenderer";
import { MarbleCircle } from "./shapes/MarbleCircle";
import { Shape } from "./shapes/Shape";

export class Ripple extends Actor {
    setup(scene: Scene): void {

    }
    pressed(e: MousePressedEvent): void {

    }

    shape = new MarbleCircle();

    get isDie() { return this.shape.opacity < 0; }

    growingSpeed = 8;

    constructor(location: Vector2D) {
        super();
        this.location = location;
    }

    update(deltaTime: number, scene: Scene): void {
        const shape = this.shape;

        shape.opacity -= 1 * deltaTime;
        this.scale += this.growingSpeed * deltaTime;
        shape.draw(this.location.x, this.location.y, 0, this.scale, deltaTime, scene);
    }
}


export class RippleServer extends Actor {
    ripples: Ripple[] = [];

    setup(scene: Scene): void {
    }

    update(deltaTime: number, scene: Scene): void {
        for (const r of this.ripples) {
            r.update(deltaTime, scene);
            if (r.isDie) {
                this.ripples = this.ripples.filter(x => r !== x);
            }
        }
    }

    pressed(e: MousePressedEvent): void {
        this.ripples.push(new Ripple(e.position));
    }
}
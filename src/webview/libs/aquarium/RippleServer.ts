import { Actor } from "../core/Actor";
import { Color } from "../core/Color";
import { MousePressedEvent } from "../core/MouseEvent";
import { Random } from "../core/Random";
import { Scene } from "../core/Scene";
import { Vector2D } from "../core/Vector2D";
import { IRenderer } from "../core/IRenderer";
import { MarbleCircle } from "./shapes/MarbleCircle";
import { Shape } from "../core/Shape";
import { DrawableShapeComponent } from "../core/DrawableShapeComponent";

export class Ripple extends Actor {
    readonly shape: MarbleCircle

    constructor() {
        super()

        this.addComponents([
            new DrawableShapeComponent(
                this.shape = new MarbleCircle()
            ),
        ])
    }

    setup(scene: Scene): void {
        super.setup(scene)
    }

    pressed(e: MousePressedEvent): void {

    }

    get isDie() { return this.shape.opacity < 0; }

    growingSpeed = 8;

    update(deltaTime: number): void {
        super.update(deltaTime)

        const shape = this.shape;

        shape.opacity -= 1 * deltaTime;
        this.scale += this.growingSpeed * deltaTime;
        shape.draw(this.location.x, this.location.y, 0, this.scale, deltaTime, this.scene);
    }
}


export class RippleServer extends Actor {
    ripples: Ripple[] = [];

    setup(scene: Scene): void {
        super.setup(scene)
    }

    update(deltaTime: number): void {
        super.update(deltaTime)
        for (const r of this.ripples) {
            r.update(deltaTime);
            if (r.isDie) {
                this.ripples = this.ripples.filter(x => r !== x)
                this.scene.remove(r)
            }
        }
    }

    pressed(e: MousePressedEvent): void {
        this.ripples.push(this.instantiate(new Ripple(), e.position));
    }
}
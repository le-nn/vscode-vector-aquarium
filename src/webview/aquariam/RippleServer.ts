import { Actor } from "./core/Actor";
import { Color } from "./core/Color";
import { MousePressedEvent } from "./core/MouseEvent";
import { Random } from "./core/Random";
import { Scene } from "./core/Scene";
import { Vector2D } from "./core/Vector2D";
import { IColony } from "./IColoney";
import { IRenderer } from "./IRenderer";
import { MarbleCircle } from "./shapes/MarbleCircle";

export class Ripple implements IColony {
    shape = new MarbleCircle();
    locatoin = new Vector2D(300, 300);
    vector = new Vector2D(0, 0);

    get location(): Vector2D { return this.shape.location; };
    set location(value: Vector2D) { this.shape.location = value; };

    get isDie() { return this.shape.opacity < 0; }

    growingSpeed = 40;
    paledOutSpeed = 1;

    constructor(location: Vector2D) {
        this.location = location;
    }

    translate(vector: Vector2D): void {

    }

    update(deltaTime: number, scene: Scene): void {
        const shape = this.shape;

        shape.opacity -= 1 * deltaTime;
        shape.size += this.growingSpeed * deltaTime;
        shape.draw(deltaTime, scene.renderer);
    }

    rotate(angle: number): void {
        throw new Error("Method not implemented.");
    }
}


export class RippleServer extends Actor {
    ripples: Ripple[] = [];

    setup(scene: Scene): void {
    }

    update(deltaTime: number, scene: Scene): void {
        for (const r of this.ripples) {
            r.update(deltaTime, scene);
            if (r.isDie)
                this.ripples = this.ripples.filter(x => r !== x);
        }
    }

    pressed(e: MousePressedEvent): void {
        this.ripples.push(new Ripple(e.position));
    }
}
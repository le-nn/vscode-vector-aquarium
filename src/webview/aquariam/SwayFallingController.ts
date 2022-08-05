import { Actor } from "./core/Actor";
import { MousePressedEvent } from "./core/MouseEvent";
import { Scene } from "./core/Scene";
import { Shape } from "./shapes/Shape";

export class SweyFallingController<TActor extends Actor = Actor> extends Actor {
    private waveOffcet = 0;

    actor: TActor;
    isDie = false;
    speed = 80;
    waveWidth = 60;

    constructor(c: TActor) {
        super();
        this.actor = c;
    }

    update(deltaTime: number, scene: Scene): void {
        this.waveOffcet += 0.1;

        const y = this.actor.location.y;
        this.actor.translateFromVector({
            x: Math.sin(this.waveOffcet) * this.waveWidth * deltaTime,
            y: this.speed * deltaTime
        });

        if (y >= scene.height) {
            this.isDie = true;
        }

        this.actor.update(deltaTime, scene);
    }

    setup(scene: Scene): void {

    }

    pressed(e: MousePressedEvent): void {

    }
}
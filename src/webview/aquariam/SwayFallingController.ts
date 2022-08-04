import { Vector2D } from "./core/Vector2D";
import { IColony } from "./IColoney";
import { IController } from "./IController";
import { Scene } from "./core/Scene";

export class SweyFallingController<T extends IColony> implements IController {
    colony: T;
    private waveOffcet = 0;
    isDie = false;

    speed = 80;
    waveWidth = 60;

    constructor(c: T) {
        this.colony = c;
    }

    update(deltaTime: number, scene: Scene): void {
        this.waveOffcet += 0.1;

        const y = this.colony.location.y;
        this.colony.translate({
            x: Math.sin(this.waveOffcet) * this.waveWidth * deltaTime,
            y: this.speed * deltaTime
        });

        if (y >= scene.height) {
            this.isDie = true;
        }

        this.colony.update(deltaTime, scene);
    }
}
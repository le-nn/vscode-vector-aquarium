import { Vector2D } from "../../core/Vector2D";
import { Random } from "../../core/Random";
import { Color } from "../../core/Color";
import { Scene } from "../../core/Scene";
import { MarbleCircle } from "./MarbleCircle";
import { Shape } from "../../core/Shape";

export class FoodShape extends Shape {
    size = 0.3;
    shape: MarbleCircle;

    public constructor() {
        super();

        this.shape = new MarbleCircle({
            layersOverride: [
                Random.getRandomColor(),
                Random.getRandomColor(),
                Random.getRandomColor(),
                Random.getRandomColor(),
            ],
        });
    }

    draw(x: number, y: number, angle: number, scale: number, deltaTime: number, scene: Scene): void {
        this.shape.draw(x, y, angle, this.size * scale, deltaTime, scene);
    }
}

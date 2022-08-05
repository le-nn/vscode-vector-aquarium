import { Vector2D } from "./core/Vector2D";
import { Random } from "./core/Random";
import { Color } from "./core/Color";
import { Scene } from "./core/Scene";
import { MarbleCircle } from "./shapes/MarbleCircle";
import { Shape } from "./shapes/Shape";

/// <summary>
///
/// </summary>
export class Food extends Shape {
    size = 0.3;
    shape: MarbleCircle;

    /// <summary>
    ///
    /// </summary>
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

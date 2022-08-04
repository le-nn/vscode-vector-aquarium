import { Vector2D } from "./core/Vector2D";
import { Random } from "./core/Random";
import { Color } from "./core/Color";
import { IColony } from "./IColoney";
import { Scene } from "./core/Scene";
import { MarbleCircle } from "./shapes/MarbleCircle";

/// <summary>
///
/// </summary>
export class Food implements IColony {
    get location(): Vector2D { return this.shape.location; };
    set location(value: Vector2D) { this.shape.location = value; };

    get size() { return this.shape.size; }
    set size(value: number) { this.shape.size = value; }

    isDie = false;

    shape: MarbleCircle;

    /// <summary>
    ///
    /// </summary>
    public constructor(location: Vector2D) {
        this.shape = new MarbleCircle({
            layersOverride: [
                Random.getRandomColor(),
                Random.getRandomColor(),
                Random.getRandomColor(),
                Random.getRandomColor(),
            ],
        });

        this.location = location;
        this.size = 3 + Random.nextDouble();
    }

    vector: Vector2D = { x: 0, y: 0 };

    update(deltaTime: number, scene: Scene): void {
        this.shape.draw(deltaTime, scene.renderer);
    }

    translate(vector: Vector2D): void {
        this.location.x += vector.x;
        this.location.y += vector.y;
    }

    rotate(angle: number): void {
    }
}

import { Scene } from "./Scene";
import { Vector2D } from "./Vector2D";

export abstract class Shape {
    abstract draw(x: number, y: number, angle: number, scale: number, deltaTime: number, scene: Scene): void;
}
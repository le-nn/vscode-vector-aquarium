import { Vector2D } from "./Vector2D";

export interface Transform {
    location: Vector2D;
    angle: number;
    scale: number;
}
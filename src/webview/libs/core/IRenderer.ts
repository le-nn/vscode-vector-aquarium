import { Color } from "./Color";
import { Vector2D } from "./Vector2D";

export interface IRenderer {
    drawStrokeCircle(x: number, y: number, r: number, lineWidth: number, color: Color): void;
    drawCircle(x: number, y: number, r: number, color: Color): void;
    drawLine(x1: number, y1: number, x2: number, y2: number, width: number, color: Color): void;
    pushMatrix(): void;
    popMatrix(): void;
    translate(x: number, y: number): void;
    rotate(angle: number): void;
    lineTo(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    clear(x: number, y: number, width: number, height: number): void;
    closePathFill(color: Color): void;
    closePathStroke(color: Color): void;
    beginPath(): void;
}

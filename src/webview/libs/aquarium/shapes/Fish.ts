import { Vector2D } from "../../core/Vector2D";
import { Color } from "../../core/Color";
import { Random } from "../../core/Random";
import { Numerics } from "../../core/Numerics";
import { Scene } from "../../core/Scene";
import { Shape } from "../../core/Shape";

/**
 * Represents a fish.
 */
export class FishShape extends Shape {
    private _sizeBias = 0.3;
    private _segLength = 14.0;

    segmentLocation = new Array<Vector2D>(10);
    finAngle = 0;
    finDirection = 30;
    lightSegmentIndex = -1;
    color: Color;

    isFlicking = false;

    public constructor(color?: Color) {
        super();

        for (let i = 0; i < 10; i++) {
            this.segmentLocation[i] = new Vector2D(0, 0);
        }

        this.color = color || Random.getRandomColor();
    }

    public draw(x: number, y: number, angle: number, scale: number, deltaTime: number, scene: Scene) {
        this.drawSegment(0, x, y, scale, scene, deltaTime);
        for (let i = 0; i < 8; i++) {
            this.drawSegment(
                i + 1,
                this.segmentLocation[i].x,
                this.segmentLocation[i].y,
                scale,
                scene,
                deltaTime
            );
        }
    }

    private drawSegment(i: number, xin: number, yin: number, scale: number, scene: Scene, deltaTime: number) {
        const size = scale * this._sizeBias;
        const segLength = this._segLength;

        const dx = xin - this.segmentLocation[i].x;
        const dy = yin - this.segmentLocation[i].y;
        const angle = Math.atan2(dy, dx);
        const x = this.segmentLocation[i].x = (xin - Math.cos(angle) * segLength * size);
        const y = this.segmentLocation[i].y = (yin - Math.sin(angle) * segLength * size);
        const renderer = scene.renderer;

        // セグメントを光らせる
        if (i === this.lightSegmentIndex) {

            // .paintColor = paint.Color = Config.FishColorList[e % 7];
        }
        else {
            // paint.Color = paint.Color = color;
        }

        // afirst segment
        if (i === 1) {
            // move fin and draw
            this.finAngle = Numerics.lerp(this.finAngle, this.finDirection, 0.04) * deltaTime;
            if (this.finAngle >= 13) {
                this.finDirection = 0;
            }
            if (this.finAngle <= 2) {
                this.finDirection = 15;
            }

            renderer.drawLine(
                x + Math.cos(angle + Numerics.toRadians(120)) * 10 * size,
                y + Math.sin(angle + Numerics.toRadians(120)) * 10 * size,
                x + Math.cos(angle + Numerics.toRadians(145 + this.finAngle)) * 45 * size,
                y + Math.sin(angle + Numerics.toRadians(145 + this.finAngle)) * 45 * size,
                3 * size,
                this.color
            );
            renderer.drawLine(
                x + Math.cos(angle + Numerics.toRadians(-120)) * 10 * size,
                y + Math.sin(angle + Numerics.toRadians(-120)) * 10 * size,
                x + Math.cos(angle + Numerics.toRadians(-145 - this.finAngle)) * 45 * size,
                y + Math.sin(angle + Numerics.toRadians(-145 - this.finAngle)) * 45 * size,
                3 * size,
                this.color
            );

            // ヒレ先端の点
            // this.renderer.fill();
            renderer.drawCircle(
                x + Math.cos(angle + Numerics.toRadians(145 + this.finAngle)) * 45 * size,
                y + Math.sin(angle + Numerics.toRadians(145 + this.finAngle)) * 45 * size,
                4 * size,
                this.color
            );
            renderer.drawCircle(
                x + Math.cos(angle + Numerics.toRadians(-145 - this.finAngle)) * 45 * size,
                y + Math.sin(angle + Numerics.toRadians(-145 - this.finAngle)) * 45 * size,
                4 * size,
                this.color
            );

            renderer.drawCircle(
                this.segmentLocation[i].x,
                this.segmentLocation[i].y,
                (10 - i) * 1.2 * size,
                this.color
            );
        }
        // odd column
        else if (i % 2 === 1) {
            renderer.drawCircle(
                this.segmentLocation[i].x,
                this.segmentLocation[i].y,
                1.5 * size,
                this.color
            );
            renderer.drawStrokeCircle(
                this.segmentLocation[i].x,
                this.segmentLocation[i].y,
                (10 - i) * 1.2 * size,
                7,
                this.color
            );
        }
        // even column
        else {
            renderer.drawCircle(
                this.segmentLocation[i].x,
                this.segmentLocation[i].y,
                (10 - i) * 0.5 * size,
                this.color);
        }
    }
}

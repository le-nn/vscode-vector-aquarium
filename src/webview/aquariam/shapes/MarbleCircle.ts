import { Color } from "../core/Color";
import { Random } from "../core/Random";
import { Vector2D } from "../core/Vector2D";
import { IRenderer } from "../IRenderer";
import { Shape } from "./Shape";

interface MarbleCircleShapeOption {
    color?: Color;
    location?: Vector2D;
    opacity?: number;
    layersOverride?: Color[];
    layerNum?: number;
    size?: number;
}

export class MarbleCircle extends Shape {
    location = new Vector2D(0, 0);
    size = 10;
    opacity = 1;
    layers!: Color[];
    color?: Color;
    layerNum = 6;

    constructor(option?: MarbleCircleShapeOption) {
        super();

        if (option) {
            Object.assign(this, option);
        }

        if (!this.layers) {
            const c = this.color ?? Random.getRandomColor();
            this.layers = [...new Array(this.layerNum)].map(_ => c)
                .map(c => {
                    const hsv = c.toHsv();
                    return Color.fromHsv(
                        hsv.h,
                        hsv.s - 0.3 + Random.nextDouble() * 0.3,
                        hsv.v - 0.5 + Random.nextDouble() * 0.5,
                        hsv.a);
                });
        }
    }

    draw(deltaTime: number, renderer: IRenderer): void {
        let s = this.size;
        for (const c of this.layers) {
            c.a = this.opacity;
            renderer.drawCircle(this.location.x, this.location.y, s, c);
            s = Math.max(0, s - this.size * 0.2);
        }
    }
}
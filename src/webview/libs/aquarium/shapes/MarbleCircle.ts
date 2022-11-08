import { Color } from "../../core/Color";
import { Random } from "../../core/Random";
import { Scene } from "../../core/Scene";
import { Vector2D } from "../../core/Vector2D";
import { IRenderer } from "../../core/IRenderer";
import { Shape } from "../../core/Shape";

interface MarbleCircleShapeOption {
    color?: Color;
    opacity?: number;
    layersOverride?: Color[];
    layerNum?: number;
}

export class MarbleCircle extends Shape {
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
            this.layers = [...new Array(this.layerNum)]
                .map(_ => c)
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

    draw(x: number, y: number, angle: number, scale: number, deltaTime: number, scene: Scene): void {
        const renderer = scene.renderer;
        let s = this.size * scale;
        const bias = 1 / this.layers.length;
        for (const c of this.layers) {
            c.a = this.opacity;
            renderer.drawCircle(x, y, s, c);
            s = Math.max(0, s - s * bias);
        }
    }
}
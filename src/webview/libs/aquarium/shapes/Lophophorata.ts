import { Actor } from "../../core/Actor";
import { Color } from "../../core/Color";
import { DrawableActor } from "../../core/DrawableActor";
import { MousePressedEvent } from "../../core/MouseEvent";
import { Numerics } from "../../core/Numerics";
import { Random } from "../../core/Random";
import { Scene } from "../../core/Scene";
import { Vector2D } from "../../core/Vector2D";
import { MarbleCircle } from "./MarbleCircle";
import { Shape } from "../../core/Shape";

export class BranchShape extends Shape {
    private readonly segments: number = 0;
    private wave = 0;
    private wave2 = 0;

    readonly segmentLength = Random.next(50, 70);
    readonly maxSegmentPointSize = 7;

    speed = 0.1;
    color: Color;

    readonly points: number[] = [];
    readonly pointFlickingSpeeds: number[] = [];

    constructor(c: Color) {
        super();

        this.wave2 = Random.next(1000);
        this.segments = 3 + Random.next(8);

        this.points = [...new Array(this.segments)].map(x => Random.next(this.segments) + Random.nextDouble());

        this.pointFlickingSpeeds = [...new Array(this.segments)].map(x => Random.next(15, 30));
        this.color = c;
    }

    draw(x: number, y: number, angle: number, scale: number, deltaTime: number, scene: Scene): void {
        const renderer = scene.renderer;

        renderer.pushMatrix();
        renderer.translate(x, y);
        renderer.rotate(Numerics.toRadians(angle));

        let wave = this.wave;
        const segments = this.segments;
        let wave2 = this.wave2;

        const rand = () => Random.nextDouble() * 0.1 * (Random.next(0, 1) === 0 ? -1 : 1);

        const c = this.color;
        const bgc = new Color(c.r, c.g, c.b, 0.12);
        const pc = new Color(c.r, c.g, c.b, 0.48);
        const pc2 = new Color(c.r, c.g, c.b, 0.09);
        const segmentLength = this.segmentLength;
        const maxSegmentPointSize = this.maxSegmentPointSize;
        const points = this.points;
        const pointFlickingSpeeds = this.pointFlickingSpeeds;

        for (let i = 0; i < segments; i++) {
            const theta = (Math.sin(wave2) * 5 + Math.sin(wave) * 10 + rand());

            const to = Numerics.lerp(segmentLength, segmentLength * 0.5, i / segments);
            points[i] += pointFlickingSpeeds[i] * deltaTime;
            const width = Math.abs(Math.sin(points[i])) * maxSegmentPointSize;

            renderer.rotate(Numerics.toRadians(theta));
            renderer.drawLine(0, 0, 0, to, width, bgc);
            renderer.drawCircle(0, 0, width * 0.3, pc);
            renderer.drawCircle(0, 0, width * 1, pc2);
            renderer.translate(0, to);

            wave2 += this.speed * 0.2 * deltaTime;
            wave += this.speed * 10;
        }

        renderer.drawCircle(0, 0, Math.abs(Math.sin(points[0])) * maxSegmentPointSize * 0.3, pc);
        renderer.drawCircle(0, 0, Math.abs(Math.sin(points[0])) * maxSegmentPointSize * 1, pc2);
        this.wave2 = wave2;
        this.wave += this.speed * deltaTime * 0.6;

        renderer.popMatrix();
    }
}

type ShapeAndAngle = {
    shape: BranchShape
    angle: number
}

export class LophophorataShape extends Shape {
    branchCount = 20;
    branches: ShapeAndAngle[] = [];
    jointLayerColors: MarbleCircle;

    constructor(color: Color, branchCount?: number) {
        super();
        this.branchCount = branchCount ?? this.branchCount;

        this.jointLayerColors = new MarbleCircle({
            color,
        });

        for (let i = 0; i < this.branchCount; i++) {
            this.branches.push({
                shape: new BranchShape(color),
                angle: Random.next(0, 360)
            });
        }
    }

    draw(x: number, y: number, angle: number, scale: number, deltaTime: number, scene: Scene): void {
        for (const b of this.branches) {
            b.shape.draw(x, y, b.angle, scale, deltaTime, scene)
        }

        this.jointLayerColors.draw(x, y, angle, scale * 0.5, deltaTime, scene);
    }
}

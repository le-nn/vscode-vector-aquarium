import { Actor } from "./core/Actor";
import { Color } from "./core/Color";
import { MousePressedEvent } from "./core/MouseEvent";
import { Numerics } from "./core/Numerics";
import { Random } from "./core/Random";
import { Scene } from "./core/Scene";
import { Vector2D } from "./core/Vector2D";
import { IColony } from "./IColoney";
import { MarbleCircle } from "./shapes/MarbleCircle";

export class Branch implements IColony {
    private wave = 0;
    readonly segments;
    angle = 0;
    private wave2 = 0;

    color: Color;
    readonly segmentLength = Random.next(18, 23);
    readonly maxSegmentPointSize = 5;
    speed = 0.1;

    readonly points: number[] = [];
    readonly pointFlickingSpeeds: number[] = [];

    constructor(c: Color) {
        this.wave2 = Random.next(1000);
        this.segments = 3 + Random.next(8);
        this.angle = Random.next(0, 360);

        this.points = [
            ...new Array(this.segments)
        ].map(x => Random.next(this.segments) + Random.nextDouble());
        this.pointFlickingSpeeds = [...new Array(this.segments)].map(x => Random.next(15, 30));
        this.color = c;
    }

    update(deltaTime: number, scene: Scene): void {
        const renderer = scene.renderer;

        renderer.pushMatrix();
        renderer.translate(this.location.x, this.location.y);
        renderer.rotate(Numerics.toRadians(this.angle));

        let wave = this.wave;
        const segments = this.segments;
        let wave2 = this.wave2;
        const rand = () => Random.nextDouble() * 0.1 * (Random.next(0, 1) === 0 ? -1 : 1);

        const c = this.color;
        const bgc = new Color(c.r, c.g, c.b, 0.1);
        const pc = new Color(c.r, c.g, c.b, 1);
        const pc2 = new Color(c.r, c.g, c.b, 0.13);
        const segmentLength = this.segmentLength;
        const maxSegmentPointSize = this.maxSegmentPointSize;
        const points = this.points;
        const pointFlickingSpeeds = this.pointFlickingSpeeds;

        for (let i = 0; i < segments; i++) {
            // 2種類のwaveを重ね合わせることで、不規則なぐにゃぐにゃを表現
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

    pressed(e: MousePressedEvent): void {

    }

    location = new Vector2D(0, 0);
    vector = new Vector2D(0, 0);

    translate(vector: Vector2D): void {

    }

    rotate(angle: number): void {

    }

}

interface LophophorataOption {
    location?: Vector2D;
    branchCount?: number;
}

export class Lophophorata extends Actor implements IColony {
    setup(scene: Scene): void {
    }
    pressed(e: MousePressedEvent): void {

    }
    location = new Vector2D(0, 0);
    vector = new Vector2D(0, 0);
    branchCount = 20;

    branches: Branch[] = [];

    jointLayerColors: MarbleCircle;
    jointCircleSize = 14;

    constructor(option?: LophophorataOption) {
        super();

        if (option) {
            Object.assign(this, option);
        }

        const c = Random.getRandomColor();

        this.jointLayerColors = new MarbleCircle({
            color: c,
            size: 5,
            location: option?.location
        });

        const branches = [];
        for (let i = 0; i < this.branchCount; i++) {
            branches.push(new Branch(c));
        }
        this.branches = branches;
    }

    translate(vector: Vector2D): void {
        this.vector = vector;
        this.location = new Vector2D(this.location.x + vector.x, this.location.y + vector.y);
    }

    update(deltaTime: number, scene: Scene): void {
        const render = scene.renderer;

        for (const b of this.branches) {
            b.location = this.location;
            b.update(deltaTime, scene);
        }

        this.jointLayerColors.draw(deltaTime, scene.renderer);
    }

    rotate(angle: number): void {

    }
}

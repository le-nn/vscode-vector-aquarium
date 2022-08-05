import { IController } from "./IController";
import { Vector2D } from "./core/Vector2D";
import { Numerics } from "./core/Numerics";
import { Scene } from "./core/Scene";
import { TargetTrackingController } from "./TargetTrackingController";
import { Color } from "./core/Color";
import { Actor } from "./core/Actor";
import { MarbleCircle } from "./shapes/MarbleCircle";
import { Shape } from "./shapes/Shape";
import { MousePressedEvent } from "./core/MouseEvent";

export class BoidController extends TargetTrackingController<Actor> {
    public readonly children: TargetTrackingController<Actor>[] = [];
    private readonly r1 = 8; // パラメータ：群れの中心に向かう度合
    private readonly r2 = 16; // パラメータ：仲間を避ける度合
    private readonly r3 = 2; // パラメータ：群れの平均速度に合わせる度合

    public get boss() {
        return this.actor;
    }

    avoidThresholdDist = 30;
    angle = 0;

    public constructor(boss: Actor) {
        super(boss);
    }

    scene: Scene | null = null;

    setup(scene: Scene): void {
        super.setup(scene);
        for (const item of this.children) {
            item.setup(scene);
        }
    }

    public addBoid(controller: TargetTrackingController<Actor>) {
        this.children.push(controller);
        this.scene && controller.setup(this.scene);
        controller.autoTarget = false;
        controller.smoothCurveTriggerDistance = Infinity;
        controller.noizeSize = 0;
    }

    public update(deltaTime: number, scene: Scene) {
        super.update(deltaTime, scene);

        for (const item of this.children) {
            this.drawAsBoid(item, deltaTime, scene);
        }

        // DEBUG
        // this.targetLocation && scene.renderer.drawCircle(this.targetLocation!.x, this.targetLocation.y, 20, new Color(255, 0, 0, 0))
    }

    private drawAsBoid(controller: TargetTrackingController<Actor>, deltaTime: number, scene: Scene) {
        const { x, y } = this.getMovementVector(controller.actor);

        // 1フレームでtargetLocationに到達させる
        const speed = Numerics.dist(
            controller.actor.location,
            new Vector2D(
                x + (controller.targetLocation?.x ?? 0),
                y + (controller.targetLocation?.y ?? 0)
            ));
        controller.translateTargetLocation(
            new Vector2D(x, y),
            speed);
        controller.update(deltaTime, scene);
    }

    getMovementVector(actor: Actor): Vector2D {
        let vx = 0;
        let vy = 0;

        let result = this.getVectorToCenter(actor);
        vx += result.x * this.r1;
        vy += result.y * this.r1;

        result = this.getVectorToAvoid(actor);
        vx += result.x * this.r2;
        vy += result.y * this.r2;

        result = this.getVectorToAverage(actor);
        vx += result.x * this.r3;
        vy += result.y * this.r3;

        vx /= 3;
        vy /= 3;

        return {
            x: vx,
            y: vy
        };
    }

    private getVectorToCenter(actor: Actor): Vector2D {
        let vx = 0; let vy = 0;
        const x = actor.location.x;
        const y = actor.location.y;

        for (const item of this.children) {
            // 参照が同じであればcontinue
            if (item.actor === actor) {
                continue;
            }
            const location = item.actor.location;
            vx += location.x;
            vy += location.y;
        }

        const count = this.children.length - 1;
        vx /= count;
        vy /= count;

        vx += this.boss.location.x;
        vy += this.boss.location.y;
        vx /= 2;
        vy /= 2;

        return Numerics.normalize(new Vector2D(vx - x, vy - y));
    }

    private getVectorToAvoid(actor: Actor): Vector2D {
        const avoidThresholdDist = this.avoidThresholdDist;
        let vx = 0; let vy = 0;
        for (const item of this.children) {
            if (item.actor === actor) {
                continue;
            }

            const location = item.actor.location;
            if (Numerics.dist(location, actor.location) < avoidThresholdDist) {
                vx -= (location.x - actor.location.x);
                vy -= (location.y - actor.location.y);
            }
        }

        const boss = this.boss;
        if (Numerics.dist(boss.location, actor.location) < avoidThresholdDist) {
            vx -= boss.location.x - actor.location.x;
            vy -= boss.location.y - actor.location.y;
        }

        return Numerics.normalize(new Vector2D(vx, vy));
    }

    private getVectorToAverage(actor: Actor): Vector2D {
        let vx = 0; let vy = 0;

        for (const item of this.children) {
            // 参照が同じであればcontinue
            if (item.actor === actor) {
                continue;
            }
            const vector = item.actor.vector;
            vx += vector.x;
            vy += vector.y;
        }

        vx += this.boss.vector.x;
        vy += this.boss.vector.y;

        // count = boids - own + boss
        const count = this.children.length;
        vx /= count;
        vy /= count;

        return Numerics.normalize(new Vector2D(vx, vy));
    }

    shock(location: Vector2D) {
        super.shock(location);

        for (const item of this.children) {
            item.shock(location);
        }
    }
}

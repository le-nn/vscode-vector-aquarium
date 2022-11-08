import { Vector2D } from "../core/Vector2D";
import { Numerics } from "../core/Numerics";
import { Scene } from "../core/Scene";
import { TargetTrackingController } from "./components/TargetTrackingController";
import { Actor } from "../core/Actor";
import { Color } from "../core/Color";

export class Boid extends Actor {
    private readonly r1 = 8; // 群れの中心に向かう度合
    private readonly r2 = 16; // 仲間を避ける度合
    private readonly r3 = 2; // 群れの平均速度に合わせる度合

    public readonly children: TargetTrackingController[] = [];

    public avoidThresholdDist = 30;

    constructor() {
        super()

        this.addComponents([
            new TargetTrackingController()
        ])
    }

    setup(scene: Scene): void {
        super.setup(scene)
    }

    public addBoid(actor: Actor) {
        const targetTrackingController = actor
            .components
            .find(x => x instanceof TargetTrackingController) as TargetTrackingController | null
        if (!targetTrackingController) {
            throw new Error("TargetTrackingController Component is not exists.")
        }

        targetTrackingController.autoTarget = false;
        this.children.push(targetTrackingController);
    }

    public update(deltaTime: number) {
        super.update(deltaTime)

        for (const item of this.children) {
            const { x, y } = this.getMovementVector(item.actor);
            // Make target reach to targetLocation in 1 frame
            item.translateTargetLocation(
                new Vector2D(x, y),
                Numerics.dist(
                    item.actor.location,
                    new Vector2D(
                        x + (item.targetLocation?.x ?? 0),
                        y + (item.targetLocation?.y ?? 0)
                    )
                )
            );
        }
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

        vx += this.location.x;
        vy += this.location.y;
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

        const boss = this;
        if (Numerics.dist(boss.location, actor.location) < avoidThresholdDist) {
            vx -= boss.location.x - actor.location.x;
            vy -= boss.location.y - actor.location.y;
        }

        return Numerics.normalize(new Vector2D(vx, vy));
    }

    private getVectorToAverage(actor: Actor): Vector2D {
        let vx = 0
        let vy = 0

        for (const item of this.children) {
            // 参照が同じであればcontinue
            if (item.actor === actor) {
                continue;
            }
            const vector = item.actor.vector;
            vx += vector.x;
            vy += vector.y;
        }

        vx += this.vector.x;
        vy += this.vector.y;

        // count = boids - own + boss
        const count = this.children.length;
        vx /= count;
        vy /= count;

        return Numerics.normalize(new Vector2D(vx, vy));
    }

    shock(location: Vector2D) {
        for (const item of this.children) {
            item.shock(location);
        }
    }
}

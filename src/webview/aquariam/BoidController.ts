import { IColony } from "./IColoney";
import { IController } from "./IController";
import { Vector2D } from "./core/Vector2D";
import { Numerics } from "./core/Numerics";
import { Scene } from "./core/Scene";
import { TargetTrackingController } from "./TargetTrackingController";

/// <summary>
/// コントローラーを群れとして表現します。
/// </summary>
/// <typeparam name="T"></typeparam>
export class BoidController extends TargetTrackingController<IColony> {
    /// <summary>
    /// 群れに属する図形のリスト
    /// </summary>
    public readonly boids: TargetTrackingController<IColony>[] = [];

    /// <summary>
    /// ボスとなる図形
    /// </summary>
    public get boss() {
        return this.colony;
    }

    avoidThresholdDist = 30;

    readonly r1 = 8; // パラメータ：群れの中心に向かう度合
    readonly r2 = 16; // パラメータ：仲間を避ける度合
    readonly r3 = 2; // パラメータ：群れの平均速度に合わせる度合

    angle = 0;

    /// <summary>
    /// コンストラクタ1
    /// </summary>1
    /// <param name="controller"></param>
    public constructor(boss: IColony) {
        super(boss);
    }

    // setSpeed(speed: number) {
    //     this.speedBias = speed;
    // }

    scene: Scene | null = null;

    setup(scene: Scene): void {
        super.setup(scene);
        for (const item of this.boids) {
            item.setup(scene);
        }
    }

    /// <summary>
    /// 群れとして表現するコントローラーを追加します。
    /// </summary>
    /// <param name="colony"></param>
    public addBoid(controller: TargetTrackingController<IColony>) {
        this.boids.push(controller);
        this.scene && controller.setup(this.scene);
        controller.autoTarget = false;
        controller.smoothCurveTriggerDistance = Infinity;
        controller.noizeSize = 0;
    }

    /// <summary>
    /// 描画処理
    /// </summary>
    /// <param name="canvas">描画するキャンバス</param>
    /// <param name="deltaTime">直前の描画にかかった時間</param>
    public update(deltaTime: number, scene: Scene) {
        // const movement = this.getMovementVector(this.boss);
        // this.boss.translate(movement);
        super.update(deltaTime, scene);


        for (const item of this.boids) {
            // item.checkFoodAction();

            // if (!item.targetLocation) {
            this.drawAsBoid(item, deltaTime, scene);
            //  }
        }

        // DEBUG
        // this.targetLocation && scene.renderer.drawCircle(this.targetLocation!.x, this.targetLocation.y, 20, new Color(255, 0, 0, 0))
    }

    private drawAsBoid(controller: TargetTrackingController<IColony>, deltaTime: number, scene: Scene) {
        const movement = this.getMovementVector(controller.colony);

        // 1フレームでtargetLocationに到達させる
        const speed = Numerics.dist(
            controller.colony.location,
            new Vector2D(
                movement.x + (controller.targetLocation?.x ?? 0),
                movement.y + (controller.targetLocation?.y ?? 0)
            ));
        controller.translateTargetLocation(
            new Vector2D(
                movement.x,
                movement.y
            ),
            speed);
        controller.update(deltaTime, scene);
    }

    getMovementVector(colony: IColony): Vector2D {
        let vx = 0;
        let vy = 0;

        let result = this.getVectorToCenter(colony);
        vx += result.x * this.r1;
        vy += result.y * this.r1;

        result = this.getVectorToAvoid(colony);
        vx += result.x * this.r2;
        vy += result.y * this.r2;
        result = this.getVectorToAverage(colony);
        vx += result.x * this.r3;
        vy += result.y * this.r3;

        vx /= 3;
        vy /= 3;

        return {
            x: vx,
            y: vy
        };
    }

    /// <summary>
    ///
    /// </summary>
    private getVectorToCenter(colony: IColony): Vector2D {
        let vx = 0; let vy = 0;
        const x = colony.location.x;
        const y = colony.location.y;

        for (const item of this.boids) {
            // 参照が同じであればcontinue
            if (item.colony === colony) {
                continue;
            }
            const location = item.colony.location;
            vx += location.x;
            vy += location.y;
        }

        const count = this.boids.length - 1;
        vx /= count;
        vy /= count;

        vx += this.boss.location.x;
        vy += this.boss.location.y;
        vx /= 2;
        vy /= 2;

        return Numerics.normalize(new Vector2D(vx - x, vy - y));
    }

    /// <summary>
    ///
    /// </summary>
    private getVectorToAvoid(colony: IColony): Vector2D {
        const avoidThresholdDist = this.avoidThresholdDist;
        let vx = 0; let vy = 0;
        for (const item of this.boids) {
            // 参照が同じであればcontinue
            if (item.colony === colony) {
                continue;
            }

            const location = item.colony.location;
            if (Numerics.dist(location, colony.location) < avoidThresholdDist) {
                vx -= (location.x - colony.location.x);
                vy -= (location.y - colony.location.y);
            }
        }

        const boss = this.boss;
        if (Numerics.dist(boss.location, colony.location) < avoidThresholdDist) {
            vx -= boss.location.x - colony.location.x;
            vy -= boss.location.y - colony.location.y;
        }

        return Numerics.normalize(new Vector2D(vx, vy));
    }

    /// <summary>
    /// 整列
    /// </summary>
    private getVectorToAverage(colony: IColony): Vector2D {
        let vx = 0; let vy = 0;

        for (const item of this.boids) {
            // 参照が同じであればcontinue
            if (item.colony === colony) {
                continue;
            }
            const vector = item.colony.vector;
            vx += vector.x;
            vy += vector.y;
        }

        vx += this.boss.vector.x;
        vy += this.boss.vector.y;

        // count = boids - own + boss
        const count = this.boids.length;
        vx /= count;
        vy /= count;

        return Numerics.normalize(new Vector2D(vx, vy));
    }

    shock(location: Vector2D) {
        super.shock(location);

        for (const item of this.boids) {
            item.shock(location);
        }
    }
}

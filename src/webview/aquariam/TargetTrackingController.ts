import { Vector2D } from "./core/Vector2D";
import { IController } from "./IController";
import { Random } from "./core/Random";
import { Numerics } from "./core/Numerics";
import { Scene } from "./core/Scene";
import { Actor } from "./core/Actor";
import { MousePressedEvent } from "./core/MouseEvent";
import { FoodProvider } from "./FoodProvider";
import { DrawableActor } from "./core/DrawableActor";

export class TargetTrackingControllerOption {
    public speedBias = 1;
}

export class TargetTrackingController<T extends Actor> extends Actor implements IController<Actor> {
    actor: T;
    public speed = 1.0;
    speedBias = 2;
    targetLocation: Vector2D | null = null;
    food: DrawableActor | null = null;
    smoothCurveRate: number;
    autoTarget = true;
    endForceTrack: null | (() => void) = null;
    shockAvoidDistance = 80;
    shockThreshouldDistance = 80;
    foodTriggerDistance = 120;
    isShowEnabled = true;
    isFoodEnabled = true;
    foodViewableAngleDeg = 160;
    foodProvider: FoodProvider | null = null;
    smoothCurveTriggerDistance = Infinity;
    debug = false;

    get isForceTracking() {
        return !!this.endForceTrack;
    }

    noizeSize = 1;

    public constructor(
        actor: T,
        speed = 125,
        smoothCurveRate = 0.01
    ) {
        super();

        this.actor = actor;
        this.speedBias = speed;
        this.smoothCurveRate = smoothCurveRate;
        // actor.IsFlicking = false;
    }

    setup(scene: Scene): void {
        const p = scene.actors.find(x => x instanceof FoodProvider);
        if (p) {
            this.foodProvider = p as FoodProvider;
        }
    }

    pressed(e: MousePressedEvent): void {
        this.shock(e.position);
    }

    update(deltaTime: number, scene: Scene) {
        this.endForceTrack?.();
        const location = this.actor.location;

        // 捕食できる餌がないかチェックしあればトラッキング
        this.checkFoodAction();

        try {
            // 目的地が設定されていなければ目的地を初期化
            if (!this.targetLocation) {
                if (this.autoTarget) {
                    this.initTargetLocation(
                        new Vector2D(
                            Random.next(scene.width),
                            Random.next(scene.height)));
                }

                return;
            }

            // if (this.debug) {
            //     scene.renderer.drawCircle(this.targetLocation!.x, this.targetLocation!.y, 20, new Color(255, 255, 0));
            // }

            let x = this.targetLocation.x - location.x;
            let y = this.targetLocation.y - location.y;

            const noisev = () => Math.random() * 0.5 * this.speed * this.noizeSize;

            const angleDiff = Math.atan2(y, x);
            this.angle = Numerics.lerpAngle(this.angle, angleDiff, this.smoothCurveRate);

            // 線形補間した角度をベクトル変換し足すことで、滑らかに大まわりに回転させる
            if (Numerics.dist(this.targetLocation, location) > this.smoothCurveTriggerDistance) {
                x = Math.cos(this.angle);
                y = Math.sin(this.angle);
            }

            // 正規化してスピードとデルタタイムを合わせる
            const vector = Numerics.normalize(new Vector2D(x, y));
            const vx = vector.x * this.speed + noisev();
            const vy = vector.y * this.speed + noisev();

            this.actor.translateFromVector(new Vector2D(vx * deltaTime, vy * deltaTime));
            this.actor.setAngle(this.angle);

            // 次回のフレームで初期化させるため
            if (Numerics.dist(this.actor.location, this.targetLocation) <= 20.0) {
                if (this.autoTarget && !this.isForceTracking) {
                    this.targetLocation = null;
                }
            }
        }
        finally {
            this.actor.update(deltaTime, scene);
        }
    }

    private initTargetLocation(location: Vector2D) {
        this.targetLocation = location;
        this.speed = this.speedBias * (1.0 + Random.nextDouble() * 0.5);
    }

    translateTargetLocation(location: Vector2D, speed?: number) {
        if (this.isForceTracking || this.food) {
            return;
        }

        if (speed) {
            this.speed = speed;
        }

        if (!this.targetLocation) {
            this.targetLocation = ({
                x: location.x,
                y: location.y
            });
        }
        else {
            this.targetLocation = ({
                x: this.targetLocation.x + location.x,
                y: this.targetLocation.y + location.y
            });
        }
    }

    shock(inputlocation: Vector2D) {
        const location = this.actor.location;

        if (Numerics.dist(inputlocation, location) <= this.shockThreshouldDistance) {
            this.endForceTrack && this.endForceTrack();

            // 入力の座標とプリミティブの座標のベクトルの逆の地点を目的地へ設定
            // 速度も上げる
            const vec = Numerics.normalize(new Vector2D(
                inputlocation.x - location.x,
                inputlocation.y - location.y));
            const x = location.x - vec.x * this.shockAvoidDistance;
            const y = location.y - vec.y * this.shockAvoidDistance;

            const lastSpeed = this.speed;
            const target = this.targetLocation;

            this.targetLocation = new Vector2D(x, y);
            this.speed = this.speedBias * 5;
            this.endForceTrack = () => {
                if (!this.targetLocation) {
                    return;
                }

                if (Numerics.dist(this.actor.location, this.targetLocation) <= 20.0) {
                    this.speed = lastSpeed;
                    this.targetLocation = target;
                    this.endForceTrack = null;
                }
            };
        }
    }

    private checkFoodAction() {
        const getEanableFood = () => {
            if (!this.foodProvider) {
                return null;
            }

            const foods = this.foodProvider.foods;
            if (foods.length > 0) {
                // the nearest food
                let food = foods[0].actor;
                for (let i = 1; i < foods.length; i++) {
                    if (
                        Numerics.dist(
                            this.actor.location,
                            foods[i].actor.location)
                        <
                        Numerics.dist(
                            this.actor.location,
                            food.location)
                    ) {
                        food = foods[i].actor;
                    }
                }

                if (Numerics.dist(this.actor.location, food.location) <= this.foodTriggerDistance) {
                    const angleDiff = Math.atan2(food.location.y - this.actor.location.y, food.location.x - this.actor.location.x);
                    const a = Math.atan2(this.actor.vector.y, this.actor.vector.x);
                    if (Math.abs(a - angleDiff) < Numerics.toRadians(this.foodViewableAngleDeg * 0.5)) {
                        return food;
                    }
                }
            }

            return null;
        };

        const f = getEanableFood();
        if (f) {
            if (this.food || this.endForceTrack) {
                return;
            }

            const target = this.targetLocation;
            const lastSpeed = this.speed;

            this.targetLocation = f.location;
            this.speed = this.speedBias * 1.8;
            this.food = f;

            this.endForceTrack = () => {
                if (!this.foodProvider) {
                    return;
                }

                if (!this.food || Numerics.dist(this.actor.location, this.food.location) <= 10.0) {

                    if (this.food) {
                        this.foodProvider.remove(this.food);
                    }
                    this.food = null;
                    this.targetLocation = target;
                    this.speed = lastSpeed;
                    this.endForceTrack = null;
                }
            };
        }
        else {
            this.food = null;
        }
    }
}

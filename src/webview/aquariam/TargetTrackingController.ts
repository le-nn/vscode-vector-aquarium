import { Vector2D } from "./core/Vector2D"
import { IController } from "./IController"
import { Random } from "./core/Random"
import { Numerics } from "./core/Numerics"
import { Scene } from "./core/Scene"
import { Actor } from "./core/Actor"
import { MousePressedEvent } from "./core/MouseEvent"
import { FoodProvider } from "./FoodProvider"
import { DrawableActor } from "./core/DrawableActor"
import { Color } from "./core/Color"
import { EmptyActor } from "./core/EmptyActor"

export class TargetTrackingControllerOption {
    public speedBias = 1
}

export class TargetTrackingController<T extends Actor> extends Actor implements IController<Actor> {
    private _actualSpeed = 0

    private _targetLocation: Vector2D | null = null
    private food: DrawableActor | null = null
    private smoothCurveRate: number = 0.1

    private endForceTrack: null | (() => void) = null
    private shockAvoidDistance = 120
    private shockThreshouldDistance = 80
    private foodTriggerDistance = 120

    private foodViewableAngleDeg = 160
    private foodProvider: FoodProvider | null = null
    private debug = false

    public noiseSize = 1

    public autoTarget = true

    public actor: T

    public speed = 1.0

    public smoothCurveTriggerDistance = Infinity

    public isShowEnabled = true

    public isFoodEnabled = true

    private get speedBias() {
        return 125 * this.speed
    }

    get targetLocation() {
        return this._targetLocation
    }

    get isForceTracking() {
        return !!this.endForceTrack
    }

    public constructor(
        actor: T,
        speed: number = 1
    ) {
        super()
        this.speed = speed
        this.actor = actor
    }

    public setup(scene: Scene): void {
        const p = scene.actors.find(x => x instanceof FoodProvider)
        if (p) {
            this.foodProvider = p as FoodProvider
        }
    }

    public pressed(e: MousePressedEvent): void {
        this.shock(e.position)
    }

    public update(deltaTime: number, scene: Scene) {
        this.endForceTrack?.()
        const location = this.actor.location
        this.checkFoodAction()

        try {
            if (!this._targetLocation) {
                if (this.autoTarget) {
                    this.initTargetLocation(
                        new Vector2D(
                            Random.next(scene.width),
                            Random.next(scene.height)
                        )
                    )
                }

                return
            }

            if (!(this.actor instanceof EmptyActor)) {
                console.log(this._targetLocation)
            }

            // if (this.debug) {
            // scene.renderer.drawCircle(this._targetLocation!.x, this._targetLocation!.y, 5, new Color(255, 255, 0))
            // }   

            let x = this._targetLocation.x - location.x
            let y = this._targetLocation.y - location.y
            const noise = () => Math.random() * 0.5 * this._actualSpeed * this.noiseSize

            const angleDiff = Math.atan2(y, x)
            this.angle = Numerics.lerpAngle(this.angle, angleDiff, this.smoothCurveRate)

            const vector = Numerics.normalize(new Vector2D(x, y))
            const vx = vector.x * this._actualSpeed + noise()
            const vy = vector.y * this._actualSpeed + noise()

            this.actor.translateFromVector(new Vector2D(vx * deltaTime, vy * deltaTime))
            this.actor.setAngle(this.angle)

            // init in next frame
            if (Numerics.dist(this.actor.location, this._targetLocation) <= 20.0) {
                if (this.autoTarget && !this.isForceTracking) {
                    this._targetLocation = null
                }
            }
        }
        finally {
            this.actor.update(deltaTime, scene)
        }
    }

    public translateTargetLocation(location: Vector2D, speed?: number) {
        if (this.isForceTracking || this.food) {
            return
        }

        if (speed) {
            this._actualSpeed = speed
        }

        if (!this._targetLocation) {
            this._targetLocation = ({
                x: location.x,
                y: location.y
            })
        }
        else {
            this._targetLocation = ({
                x: this._targetLocation.x + location.x,
                y: this._targetLocation.y + location.y
            })
        }
    }

    public shock(inputLocation: Vector2D) {
        const location = this.actor.location
        if (Numerics.dist(inputLocation, location) <= this.shockThreshouldDistance) {
            this.endForceTrack?.()

            const shockAvoidDistance = this.shockAvoidDistance

            const vec = Numerics.normalize(
                new Vector2D(
                    inputLocation.x - location.x,
                    inputLocation.y - location.y
                )
            )
            const x = location.x - vec.x * shockAvoidDistance * Random.nextDouble()
            const y = location.y - vec.y * shockAvoidDistance * Random.nextDouble()

            const newTarget = new Vector2D(x, y)
            const targetSpeed = this._actualSpeed * 5
            const lastSpeed = this._actualSpeed
            const dist = Numerics.dist(this.actor.location, newTarget) * 0.6

            this._targetLocation = newTarget

            this.endForceTrack = () => {
                if (!this._targetLocation) {
                    return
                }

                // when the target is reached
                if (Numerics.dist(this.actor.location, this._targetLocation) <= 5) {
                    this.endForceTrack = null
                    this._targetLocation = new Vector2D(
                        this._targetLocation.x + Random.nextDouble() * shockAvoidDistance,
                        this._targetLocation.y + Random.nextDouble() * shockAvoidDistance
                    )
                    this._actualSpeed = lastSpeed
                }
                // when half of distance is reached
                else if (Numerics.dist(this.actor.location, this._targetLocation) <= dist) {
                    this._actualSpeed = Numerics.lerp(this._actualSpeed, lastSpeed, 0.24)
                }
                else {
                    this._actualSpeed = Numerics.lerp(this._actualSpeed, targetSpeed, 0.08)
                }
            }
        }
    }

    private initTargetLocation(location: Vector2D) {
        this._targetLocation = location
        this._actualSpeed = this.speedBias * (1.0 + Random.nextDouble() * 0.5)
    }

    private checkFoodAction() {
        const getAvailableFood = () => {
            if (!this.foodProvider) {
                return null
            }

            const foods = this.foodProvider.foods
            if (foods.length > 0) {
                // the nearest food
                let food = foods[0].actor
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
                        food = foods[i].actor
                    }
                }

                if (Numerics.dist(this.actor.location, food.location) <= this.foodTriggerDistance) {
                    const angleDiff = Math.atan2(food.location.y - this.actor.location.y, food.location.x - this.actor.location.x)
                    const a = Math.atan2(this.actor.vector.y, this.actor.vector.x)
                    if (Math.abs(a - angleDiff) < Numerics.toRadians(this.foodViewableAngleDeg * 0.5)) {
                        return food
                    }
                }
            }

            return null
        }

        const f = getAvailableFood()
        if (f) {
            if (this.food || this.endForceTrack) {
                return
            }

            const target = this._targetLocation
            const lastSpeed = this._actualSpeed

            this._targetLocation = f.location
            this._actualSpeed = this.speedBias * 1.5
            this.food = f

            this.endForceTrack = () => {
                if (!this.foodProvider) {
                    return
                }

                if (!this.food || Numerics.dist(this.actor.location, this.food.location) <= 10.0) {
                    if (this.food) {
                        this.foodProvider.remove(this.food)
                    }

                    this.food = null
                    this._targetLocation = target
                    this._actualSpeed = lastSpeed
                    this.endForceTrack = null
                }
            }
        }
        else {
            this.food = null
        }
    }
}

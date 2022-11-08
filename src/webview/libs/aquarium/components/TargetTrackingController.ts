import { Vector2D } from "../../core/Vector2D"
import { Random } from "../../core/Random"
import { Numerics } from "../../core/Numerics"
import { Scene } from "../../core/Scene"
import { Actor } from "../../core/Actor"
import { MousePressedEvent } from "../../core/MouseEvent"
import { DrawableActor } from "../../core/DrawableActor"
import { Color } from "../../core/Color"
import { EmptyActor } from "../../core/EmptyActor"
import { Component } from "../../core/Component"
import { Food } from "../Food"
import { FoodProvider } from "../FoodProvider"

export class TargetTrackingController extends Component {
    private _actualSpeed = 0
    private _angle = 0
    private _targetLocation: Vector2D | null = null
    private food: Food | null = null
    private smoothCurveRate: number = 0.1
    private foodTriggerDistance = 120
    private _noiseSize = 1

    private _hook: null | (() => void) = null

    private _foodViewableAngleDeg = 160
    private _foodProvider: FoodProvider | null = null
    private _lastDeltaTime = 0

    public shockAvoidDistance = 120
    public shockTriggerDistance = 80
    public shockedSpeed = 1

    public speed = 1.0

    public autoTarget = true
    public isShockEnabled = true
    public isFoodEnabled = true

    private get speedBias() {
        return 125 * this.speed
    }

    public get targetLocation() {
        return this._targetLocation
    }

    public get isForceTracking() {
        return !!this._hook
    }

    constructor(speed: number = 1) {
        super()
        this.speed = speed
    }

    public setup(scene: Scene, actor: Actor): void {
        super.setup(scene, actor)

        const p = scene.actors.find(x => x instanceof FoodProvider)
        if (p) {
            this._foodProvider = p as FoodProvider
        }
    }

    public pressed(e: MousePressedEvent): void {
        this.shock(e.position)
    }

    public update(deltaTime: number) {
        super.update(deltaTime)
        this.updateLocation(deltaTime)
        this._lastDeltaTime = deltaTime
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

        this.updateLocation(this._lastDeltaTime)
    }

    public shock(inputLocation: Vector2D) {
        if (!this.isShockEnabled) {
            return;
        }

        const location = this.actor.location
        if (Numerics.dist(inputLocation, location) >= this.shockTriggerDistance) {
            return
        }

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
        const targetSpeed = Numerics.lerp(1200, 1500, Random.nextDouble())
        const lastSpeed = Numerics.lerp(200, 300, Random.nextDouble())
        const distanceToStartDeceleration = Numerics.dist(this.actor.location, newTarget) * 0.7

        this._targetLocation = newTarget

        this._hook = () => {
            if (!this._targetLocation) {
                return
            }

            // when the target is reached
            if (Numerics.dist(this.actor.location, this._targetLocation) <= 5) {
                this._hook = null
                this._targetLocation = new Vector2D(
                    this._targetLocation.x + Random.nextDouble() * shockAvoidDistance,
                    this._targetLocation.y + Random.nextDouble() * shockAvoidDistance
                )
                this._actualSpeed = lastSpeed
            }
            // when half of distance is reached
            else if (Numerics.dist(this.actor.location, this._targetLocation) <= distanceToStartDeceleration) {
                this._actualSpeed = Numerics.lerp(this._actualSpeed, lastSpeed, 0.16)
            }
            else {
                this._actualSpeed = Numerics.lerp(this._actualSpeed, targetSpeed, 0.08)
            }
        }
    }

    public updateLocation(deltaTime: number) {
        const scene = this.scene
        this._hook?.()
        const location = this.actor.location
        this.checkFoodAction()

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

        let x = this._targetLocation.x - location.x
        let y = this._targetLocation.y - location.y
        const noise = () => Math.random() * 0.5 * this._actualSpeed * (
            this.autoTarget ? this._noiseSize : 0
        )

        const angleDiff = Math.atan2(y, x)
        this._angle = Numerics.lerpAngle(this._angle, angleDiff, this.smoothCurveRate)

        const vector = Numerics.normalize(new Vector2D(x, y))
        const vx = vector.x * this._actualSpeed + noise()
        const vy = vector.y * this._actualSpeed + noise()

        this.actor.translateFromVector(new Vector2D(vx * deltaTime, vy * deltaTime))
        this.actor.setAngle(this._angle)

        // init in next frame
        if (Numerics.dist(this.actor.location, this._targetLocation) <= 20.0) {
            if (this.autoTarget && !this.isForceTracking) {
                this._targetLocation = null
            }
        }
    }

    private initTargetLocation(location: Vector2D) {
        this._targetLocation = location
        this._actualSpeed = this.speedBias * (1.0 + Random.nextDouble() * 0.5)
    }

    private checkFoodAction() {
        if (!this.isFoodEnabled) {
            return;
        }

        const getAvailableFood = () => {
            if (!this._foodProvider) {
                return null
            }

            const foods = this._foodProvider.foods
            if (foods.length > 0) {
                // the nearest food
                let [food] = foods
                for (let i = 1; i < foods.length; i++) {
                    if (
                        Numerics.dist(
                            this.actor.location,
                            foods[i].location)
                        <
                        Numerics.dist(
                            this.actor.location,
                            food.location)
                    ) {
                        food = foods[i]
                    }
                }

                if (Numerics.dist(this.actor.location, food.location) <= this.foodTriggerDistance) {
                    const angleDiff = Math.atan2(food.location.y - this.actor.location.y, food.location.x - this.actor.location.x)
                    const a = Math.atan2(this.actor.vector.y, this.actor.vector.x)
                    if (Math.abs(a - angleDiff) < Numerics.toRadians(this._foodViewableAngleDeg * 0.5)) {
                        return food
                    }
                }
            }

            return null
        }

        const f = getAvailableFood()
        if (f) {
            if (this.food || this.isForceTracking) {
                return
            }

            const target = this._targetLocation
            const lastSpeed = this._actualSpeed

            this._targetLocation = f.location
            this._actualSpeed = this.speedBias * 1.5
            this.food = f

            this._hook = () => {
                if (!this._foodProvider) {
                    return
                }

                if (!this.food || Numerics.dist(this.actor.location, this.food.location) <= 1.0) {
                    if (this.food) {
                        this._foodProvider.remove(this.food)
                    }

                    this.food = null
                    this._targetLocation = target
                    this._actualSpeed = lastSpeed
                    this._hook = null
                }
            }
        }
        else {
            this.food = null
        }
    }
}

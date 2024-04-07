import { Actor } from "../core/Actor"
import { Color } from "../core/Color"
import { DrawableShapeComponent } from "../core/DrawableShapeComponent"
import { Transform } from "../core/Transform"
import { TargetTrackingController } from "./components/TargetTrackingController"
import { JellyfishShape } from "./shapes/JellyFish"

export class Jellyfish extends Actor {
    public readonly targetTracker: TargetTrackingController

    constructor(color: Color, speed?: number | null, transform?: Transform | null) {
        super()

        this.scale = transform?.scale ?? this.scale
        this.location = transform?.location ?? this.location
        this.angle = transform?.angle ?? this.angle

        this.addComponents([
            this.targetTracker = new TargetTrackingController((speed ?? 1) * 0.05),
            new DrawableShapeComponent(
                new JellyfishShape(color)
            )
        ])
        this.targetTracker.isFoodEnabled = false
    }
}
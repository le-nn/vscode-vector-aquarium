import { Actor } from "../core/Actor";
import { Color } from "../core/Color";
import { DrawableShapeComponent } from "../core/DrawableShapeComponent";
import { MousePressedEvent } from "../core/MouseEvent";
import { Transform } from "../core/Transform";
import { TargetTrackingController } from "./components/TargetTrackingController";
import { FishShape } from "./shapes/Fish";

export class Fish extends Actor {
    public readonly targetTracker:TargetTrackingController

    constructor(color: Color, transform?: Transform) {
        super()

        this.scale = transform?.scale ?? this.scale;
        this.location = transform?.location ?? this.location;
        this.angle = transform?.angle ?? this.angle;

        this.addComponents([
            this.targetTracker = new TargetTrackingController(),
            new DrawableShapeComponent(
                new FishShape(color)
            )
        ])
    }
    
    public override pressed(e: MousePressedEvent): void {
        super.pressed(e)
        this.targetTracker.pressed(e)
    }
}
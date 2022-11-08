import { Actor } from "../core/Actor";
import { Color } from "../core/Color";
import { DrawableShapeComponent } from "../core/DrawableShapeComponent";
import { Transform } from "../core/Transform";
import { LophophorataShape } from "./shapes/Lophophorata";

export class Lophophorata extends Actor {
    constructor(color: Color, transform?: Transform) {
        super()

        this.scale = transform?.scale ?? this.scale;
        this.location = transform?.location ?? this.location;
        this.angle = transform?.angle ?? this.angle;

        this.addComponents([
            new DrawableShapeComponent(
                new LophophorataShape(color),
            )
        ])
    }
}

import { Actor } from "../core/Actor"
import { Color } from "../core/Color"
import { DrawableShapeComponent } from "../core/DrawableShapeComponent"
import { SwayFallingController } from "./components/SwayFallingController"
import { MarbleCircle } from "./shapes/MarbleCircle"

export class Food extends Actor {
    public readonly sway = new SwayFallingController()

    constructor(color?: Color) {
        super()
        this.addComponents([
            this.sway,
            new DrawableShapeComponent(
                new MarbleCircle({
                    color,
                    size: 3
                })
            )
        ])
    }
}
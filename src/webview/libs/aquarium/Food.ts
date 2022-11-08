import { Actor } from "../core/Actor";
import { DrawableShapeComponent } from "../core/DrawableShapeComponent";
import { MousePressedEvent } from "../core/MouseEvent";
import { SwayFallingController } from "./components/SwayFallingController";
import { FoodShape } from "./shapes/Food";

export class Food extends Actor {
    public readonly sway = new SwayFallingController()

    constructor() {
        super()

        this.addComponents([
            this.sway,
            new DrawableShapeComponent(
                new FoodShape()
            )
        ])
    }
}
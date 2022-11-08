import { Component } from "./Component";
import { Shape } from "./Shape";

export class DrawableShapeComponent extends Component {
    private _shape: Shape

    constructor(shape: Shape) {
        super()
        this._shape = shape
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime)

        const actor = this.actor
        this._shape.draw(
            actor.location.x,
            actor.location.y,
            actor.angle,
            actor.scale,
            deltaTime,
            this.scene
        )
    }
}
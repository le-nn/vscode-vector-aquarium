import { Actor } from "./Actor";
import { IRenderer } from "./IRenderer";
import { animationFrame } from "../utils/animationFrame";
import { MousePressedEvent } from "./MouseEvent";
import { Vector2D } from "./Vector2D";

type Subscription = ReturnType<typeof animationFrame>;

export class Scene {
    private _actors: Actor[] = []
    private _subscription: Subscription = { end: () => { } }

    public height = 0
    public width = 0

    public get actors() {
        return this._actors
    }

    constructor(
        width: number,
        height: number,
        readonly renderer: IRenderer
    ) {
        this.width = width
        this.height = height
    }

    private append(actor: Actor) {
        actor.setup(this)
        this._actors.push(actor)
    }

    public instantiate<TActor extends Actor>(actor: TActor, location?: Vector2D, angle: number = 0, scale: number = 1) {
        if (location) {
            actor.setLocation(location)
        }

        actor.setAngle(angle)
        actor.setScale(scale)

        this.append(actor)

        return actor
    }

    public remove(actor: Actor) {
        this._actors = this.actors.filter(x => x !== actor)
    }

    public begin() {
        for (const a of this.actors) {
            a.setup(this)
        }

        this.end();
        this._subscription = animationFrame(this.tick.bind(this));
    }

    public end() {
        this._subscription.end()
    }

    public tick(deltaTime: number) {
        this.renderer.clear(0, 0, this.width, this.height)

        const actors = this._actors
        for (const a of actors) {
            a.update(deltaTime)

            if (a.isDestroyed) {
                this._actors = this.actors.filter(x => x !== a)
            }
        }
    }

    public press(e: MousePressedEvent) {
        for (const controller of this.actors) {
            controller.pressed(e)
        }
    }
}
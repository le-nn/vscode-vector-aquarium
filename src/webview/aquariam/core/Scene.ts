import { Actor } from "./Actor";
import { IRenderer } from "../IRenderer";
import { animationFrame } from "../utils/animationFrame";
import { MousePressedEvent } from "./MouseEvent";

type Subscription = ReturnType<typeof animationFrame>;

export class Scene {
    subscription: Subscription = { end: () => { } };
    height = 0;
    width = 0;
    _actors: Actor[] = [];

    get actors() {
        return this._actors;
    }

    constructor(width: number, height: number, readonly renderer: IRenderer) {
        this.width = width;
        this.height = height;
    }

    append(actor: Actor) {
        this._actors.push(actor);
        actor.setup(this);
    }

    remove(actor: Actor) {
        this._actors = this.actors.filter(x => x !== actor);
    }

    begin() {
        this.end();
        this.subscription = animationFrame(this.tick.bind(this));
        for (const a of this.actors) {
            a.setup(this);
        }
    }

    end() {
        this.subscription.end();
    }

    tick(deltaTime: number) {
        this.renderer.clear(0, 0, this.width, this.height);

        const actors = this._actors;
        for (const a of actors) {
            a.update(deltaTime, this);

            if (a.isDestroyed) {
                this._actors = this.actors.filter(x => x !== a);
            }
        }
    }

    press(e: MousePressedEvent) {
        for (const controller of this.actors) {
            controller.pressed(e);
        }
    }
}
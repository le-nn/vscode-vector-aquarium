import { Actor } from "./Actor"
import { Scene } from "./Scene"

export abstract class Component {
    private _scene: Scene | null = null
    private _actor: Actor | null = null

    public get actor() {
        if (!this._actor) {
            throw new Error("This component is not initialized.")
        }

        return this._actor
    }

    protected get scene() {
        if (!this._scene) {
            throw new Error("This component is not initialized.")
        }

        return this._scene
    }


    public setup(scene: Scene, actor: Actor): void {
        this._scene = scene
        this._actor = actor
    }

    public update(deltaTime: number): void {

    }
}
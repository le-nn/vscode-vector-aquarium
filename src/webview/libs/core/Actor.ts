import { Vector2D } from "./Vector2D";
import { Scene } from "./Scene";
import { MousePressedEvent } from "./MouseEvent";
import { Transform } from "./Transform";
import { Component } from "./Component";

export abstract class Actor implements Transform {
    private _isDestroyed = false
    private _scene: Scene | null = null
    private _components: Component[] = []
    private _lazyComponents: Component[] | null = null

    public angle = 0
    public scale = 1
    public location = new Vector2D(0, 0)
    public vector: Vector2D = new Vector2D(0, 0)

    public get isDestroyed() {
        return this._isDestroyed
    }

    public get isInitialized() {
        return !!this._scene
    }

    public get components() {
        return [...this._components]
    }

    protected get scene() {
        if (!this._scene) {
            throw new Error("The actor is not initialized.")
        }

        return this._scene
    }

    public update(deltaTime: number): void {
        for (const item of this._components) {
            item.update(deltaTime)
        }
    }

    public setup(scene: Scene): void {
        this._scene = scene

        if (this._lazyComponents) {
            this.addComponents(this._lazyComponents)
        }
    }

    public addComponents(components: Component[]) {
        for (const item of components) {
            this.addComponent(item)
        }
    }

    public addComponent(component: Component) {
        if (this.isInitialized) {
            if (this._components.find(x => x instanceof component.constructor)) {
                throw new Error(`The following component ${component} is already exists.`)
            }

            this._components.push(component)
            component.setup(this.scene, this)
        }
        else {
            if (!this._lazyComponents) {
                this._lazyComponents = []
            }
            this._lazyComponents.push(component)
        }
    }

    public removeComponent(component: Component) {
        this._components = this._components.filter(x => x !== component)
    }

    public pressed(e: MousePressedEvent): void {

    }

    public setAngle(angle: number): void {
        this.angle = angle
    }

    public setScale(scale: number) {
        this.scale = scale
    }

    public setLocation(location: Vector2D) {
        this.location.x = location.x
        this.location.y = location.y
    }

    public translateFromVector(vector: Vector2D) {

        this.vector = vector
        this.location.x += vector.x
        this.location.y += vector.y
    }

    public destroy() {
        this._isDestroyed = true
    }

    public instantiate<TActor extends Actor>(actor: TActor, location?: Vector2D, angle: number = 0, scale: number = 1) {
        this.scene.instantiate(actor,location,angle,scale)
        return actor
    }
}


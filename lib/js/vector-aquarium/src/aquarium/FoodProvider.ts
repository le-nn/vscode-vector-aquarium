import { Actor } from "../core/Actor"
import { Color } from "../core/Color"
import { MousePressedEvent } from "../core/MouseEvent"
import { Random } from "../core/Random"
import { Scene } from "../core/Scene"
import { Vector2D } from "../core/Vector2D"
import { Food } from "./Food"

export class FoodProvider extends Actor {
    foods: Food[] = []
    readonly _foodColors: string[] | null

    constructor(foodColors?: string[]) {
        super()

        this._foodColors = foodColors ?? null
    }


    public setup(scene: Scene): void {
        super.setup(scene)
    }

    public update(deltaTime: number): void {
        super.update(deltaTime)
        for (const food of this.foods) {
            if (food.isDestroyed) {
                this.remove(food)
                this.scene.remove(food)
            }
        }
    }

    public remove(food: Food) {
        this.foods = this.foods.filter(x => x !== food)
        food.destroy()
    }

    public pressed(e: MousePressedEvent): void {
        const color =  (this._foodColors?.length ?? 0) > 0 ? Color.fromColorCode(Random.randomItem(this._foodColors ?? [])) : undefined
        const food = this.instantiate(new Food(color), new Vector2D(e.position.x, 0))
        this.foods.push(food)
    }
}
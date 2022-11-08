import { Actor } from "../core/Actor";
import { DrawableActor } from "../core/DrawableActor";
import { MousePressedEvent } from "../core/MouseEvent";
import { Scene } from "../core/Scene";
import { Vector2D } from "../core/Vector2D";
import { SwayFallingController } from "./components/SwayFallingController";
import { Food } from "./Food";

export class FoodProvider extends Actor {
    foods: Food[] = [];

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
        this.foods = this.foods.filter(x => x !== food);
        food.destroy();
    }

    public pressed(e: MousePressedEvent): void {
        const food = this.instantiate(new Food(), new Vector2D(e.position.x, 0))
        this.foods.push(food);
    }
}
import { Actor } from "./core/Actor";
import { MousePressedEvent } from "./core/MouseEvent";
import { Scene } from "./core/Scene";
import { Food } from "./Food";
import { IController } from "./IController";
import { SweyFallingController } from "./SwayFallingController";

export class FoodProvider extends Actor {
    foods: SweyFallingController<Food>[] = [];

    setup(scene: Scene): void {

    }

    update(deltaTime: number, scene: Scene): void {
        for (const food of this.foods) {
            food.update(deltaTime, scene);

            if (food.isDie) {
                this.remove(food.colony);
            }
        }
    }

    remove(food: Food) {
        this.foods = this.foods.filter(x => x.colony !== food);
    }

    pressed(e: MousePressedEvent): void {
        this.foods.push(
            new SweyFallingController(
                new Food({ x: e.position.x, y: 0 })
            )
        );
    }
}
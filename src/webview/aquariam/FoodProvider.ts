import { Actor } from "./core/Actor";
import { DrawableActor } from "./core/DrawableActor";
import { MousePressedEvent } from "./core/MouseEvent";
import { Scene } from "./core/Scene";
import { Food } from "./Food";
import { IController } from "./IController";
import { SwayFallingController } from "./SwayFallingController";

export class FoodProvider extends Actor {
    foods: SwayFallingController<DrawableActor>[] = [];

    setup(scene: Scene): void {

    }

    update(deltaTime: number, scene: Scene): void {
        for (const food of this.foods) {
            food.update(deltaTime, scene);
            if (food.isDie) {
                this.remove(food.actor);
            }
        }
    }

    remove(food: DrawableActor) {
        this.foods = this.foods.filter(x => x.actor !== food);
    }

    pressed(e: MousePressedEvent): void {
        this.foods.push(
            new SwayFallingController(
                new DrawableActor(new Food(), {
                    location: { x: e.position.x, y: 0 }
                })
            )
        );
    }
}
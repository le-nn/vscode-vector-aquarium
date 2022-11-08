import { Actor } from "../../core/Actor";
import { Component } from "../../core/Component";
import { MousePressedEvent } from "../../core/MouseEvent";
import { Scene } from "../../core/Scene";
import { Shape } from "../../core/Shape";

export class SwayFallingController extends Component {
    private waveOffset = 0;
    isDead = false;
    speed = 80;
    waveWidth = 60;

    update(deltaTime: number): void {
        super.update(deltaTime)

        this.waveOffset += 0.1;

        const y = this.actor.location.y;
        this.actor.translateFromVector({
            x: Math.sin(this.waveOffset) * this.waveWidth * deltaTime,
            y: this.speed * deltaTime
        });

        if (y >= this.scene.height) {
            this.isDead = true;
        }
    }

    setup(scene: Scene, actor: Actor): void {
        super.setup(scene, actor)
    }

    pressed(e: MousePressedEvent): void {

    }
}
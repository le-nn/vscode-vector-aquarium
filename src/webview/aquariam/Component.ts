import { Scene } from "./core/Scene";

export interface IComponent {
    update(deltaTime: number, scene: Scene): void;
}
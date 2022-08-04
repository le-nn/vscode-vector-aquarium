import { IComponent } from "./Component";
import { Vector2D } from "./core/Vector2D";
import { IRenderer } from "./IRenderer";
import { Scene } from "./core/Scene";

/**
 * @summary 図形を描画するメカニズムを提供します。
 */
export interface IColony {
    location: Vector2D;
    vector: Vector2D;

    /**
     * 移動しさせます.
     * @param vector 移動量
     */
    translate(vector: Vector2D): void;

    update(deltaTime: number, scene: Scene): void;

    /**
     * 回転させます.
     * @param angle 角度
     */
    rotate(angle: number): void;
}

import { Vector2D } from "./core/Vector2D";
import { IColony } from "./IColoney";
import { Scene } from "./core/Scene";

/// <summary>
/// 目的地の座標を更新し、そこへ追従し、図形を描画するメカニズムを提供します。
/// </summary>
export interface IController<T extends IColony = IColony> {
    /// <summary>
    /// 描画する対象の図形。
    /// </summary>
    colony: T;

    /// <summary>
    ///  毎フレーム呼び出すことでアニメーションします。
    /// </summary>
    /// <param name="canvas"></param>
    /// <param name="deltaTime"></param>
    update(deltaTime: number, scene: Scene): void;
}
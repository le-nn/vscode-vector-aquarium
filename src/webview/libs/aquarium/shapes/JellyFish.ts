import { Vector2D } from "../../core/Vector2D";
import { Random } from "../../core/Random";
import { Numerics } from "../../core/Numerics";
import { Color } from "../../core/Color";
import { IRenderer } from "../../core/IRenderer";
import { Scene } from "../../core/Scene";
import { Shape } from "../../core/Shape";

export const CAP_JOINT_COUNT = 10; //  笠のポイントの数
export const ROUND_DEGREE = 360; //  一周の角度
export const HEAD_DETAIL = 30; //  笠の細かさ(描画する角度の閾値)

/// <summary>
/// 海月を表現します。
/// </summary>
export class JellyfishShape extends Shape {
    private capPointAngle = Array<number>(CAP_JOINT_COUNT); //  笠のそれぞれのポイントの広がり角度
    private capPointAngleBase = 0; //  笠の動きのベース広がり角度
    private capPointAngleBaseSpd = 0; //  笠の動きベースの速度
    private headWitherPower = 0.11; //  笠のしぼみ具合
    private headSize = 10;
    private paintColor: Color;
    private headFillPaintColor: Color;

    /// <summary>
    /// コンストラクタ
    /// </summary>
    public constructor(col: Color) {
        super();

        this.headFillPaintColor = new Color(col.r, col.g, col.b, 0.6);

        this.paintColor = new Color(col.r, col.g, col.b, 0.6);

        // かさのくねくねの動きの速さを決める
        this.capPointAngleBaseSpd = (0.4 + Random.nextDouble() * 0.25);
    }

    /**
     * プリミティブを描画します。
     * @param canvas 描画するキャンバス
     * @param location 描画する場所
     * @param angle デルタタイム
     */
    public draw(x: number, y: number, angle: number, scale: number, deltaTime: number, scene: Scene): void {
        const renderer = scene.renderer;

        renderer.pushMatrix();
        renderer.translate(x, y);
        renderer.rotate(angle + Numerics.toRadians(90));

        // 笠のポイントの広がり角度を、末端のポイントに伝える
        // 笠の列のカーブ（角度）を格納した配列を作成
        for (let i = 0; i < CAP_JOINT_COUNT - 1; i++) {
            this.capPointAngle[i] = this.capPointAngle[i + 1] + i;
        }

        this.capPointAngleBase += this.capPointAngleBaseSpd * deltaTime;
        this.capPointAngle[9] = (Math.abs(Math.sin(this.capPointAngleBase)) * 30 + 20);

        this.drawFillHead(renderer, scale);
        this.drawHeadFrame(renderer, scale);

        renderer.popMatrix();
    }

    /// <summary>
    /// 笠のフレームを描画
    /// </summary>
    /// <param name="canvas">描画するキャンバス</param>
    private drawHeadFrame(renderer: IRenderer, scale: number) {
        renderer.beginPath();
        for (let r = 90; r <= 270; r += 30) {
            let x = 0; let y = 0;
            let tx = 0; let ty = 0;
            let p = 1;
            for (let j = 0; j < CAP_JOINT_COUNT; j++) {
                p -= this.headWitherPower;
                const deg = this.capPointAngle[j];
                x += (Math.sin(Numerics.toRadians(deg)) * this.headSize * scale * Math.sin(Numerics.toRadians(r)) * p);
                y += (Math.cos(Numerics.toRadians(deg)) * this.headSize * scale);

                tx += (Math.sin(Numerics.toRadians(deg)) * this.headSize * scale * Math.sin(Numerics.toRadians(r + HEAD_DETAIL)) * p);
                ty += (Math.cos(Numerics.toRadians(deg)) * this.headSize * scale);

                renderer.lineTo(x, y);
                renderer.lineTo(tx, ty);
            }
        }
        renderer.closePathFill(this.paintColor);
    }

    /// <summary>
    /// 笠を描画
    /// </summary>
    /// <param name="canvas">描画するキャンバス</param>
    private drawFillHead(renderer: IRenderer, scale: number) {
        let p = 1;
        let x = 0;
        let y = 0;

        renderer.beginPath();
        renderer.moveTo(0, 0);

        let r = 90;

        for (let i = 0; i < CAP_JOINT_COUNT; i++) {
            p -= this.headWitherPower;
            const deg = this.capPointAngle[i];
            x += (Math.sin(Numerics.toRadians(deg)) * this.headSize * scale * Math.sin(Numerics.toRadians(r)) * p);
            y += (Math.cos(Numerics.toRadians(deg)) * this.headSize * scale);
            renderer.lineTo(x, y);
        }

        p = 1;
        x = 0;
        y = 0;
        r = 270;
        const stack: Vector2D[] = [];
        for (let i = 0; i < CAP_JOINT_COUNT; i++) {
            p -= this.headWitherPower;
            const deg = this.capPointAngle[i];
            x += (Math.sin(Numerics.toRadians(deg)) * this.headSize * scale * Math.sin(Numerics.toRadians(r)) * p);
            y += (Math.cos(Numerics.toRadians(deg)) * this.headSize * scale);
            stack.unshift(new Vector2D(x, y));
        }
        for (const stackPoint of stack) {
            renderer.lineTo(stackPoint.x, stackPoint.y);
        }
        renderer.closePathFill(this.headFillPaintColor);
    }
}

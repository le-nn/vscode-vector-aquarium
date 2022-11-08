import { Random } from "./core/Random";

/**
* 泡の制御と描画を提供します。
*/
export class BubbleEngine {
    // 速度を稼ぐため配列として表現
    x: number[] = [];
    y: number[] = [];
    dx: number[] = [];
    dy: number[] = [];
    r: number[] = [];
    color: string[] = [];
    bubbleCount: number;
    canvas: CanvasRenderingContext2D;

    constructor(canvas: CanvasRenderingContext2D, bubbleCount: number) {
        this.canvas = canvas;
        this.bubbleCount = bubbleCount;

        for (let i = 0; i < bubbleCount; i++) {
            this.add();
        }
    }

    colors: string[] = [
        "#3f51b5",
        "#2196f3",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#f44336",
        "#e91e63",
        "#9c27b0"
    ];

    public add(): void {
        const h = Random.next(0, 360);
        const s = Random.next(70, 100);
        const v = Random.next(40, 80);

        // dark theme
        // let a = Random.next(20, 40) * 0.01;

        // light theme
        // let a = Random.next(40, 80) * 0.01;
        const a = Math.floor((Random.next(30, 60) * 0.01) * 255);

        let rx = Random.next(0, 1);
        let ry = Random.next(0, 1);

        if (rx === 0) {
            rx = -1;
        }
        if (ry === 0) {
            ry = -1;
        }

        const col = this.colors[Random.next(0, 13)];

        // this.color.push(`hsla(${h},${s}%,${v}%,${a})`);
        this.color.push(`${col}${a.toString(16)}`);

        this.dx.push(rx * Random.next(5, 10));
        this.dy.push(ry * Random.next(5, 10));
        this.x.push(window.innerWidth / 2 + Random.next(-window.innerWidth / 2, window.innerWidth / 2));
        this.y.push(window.innerHeight / 2 + Random.next(-window.innerHeight / 2, window.innerHeight / 2));
        this.r.push(Random.next(2, 3) + Random.nextDouble());
    }

    // init(i) {
    //    let h = Random.next(0, 360);
    //    let s = Random.next(70, 100);
    //    let v = Random.next(40, 80);

    //    // dark theme
    //    // let a = Random.next(20, 40) * 0.01;

    //    // light theme
    //    let a = Random.next(40, 60) * 0.01;

    //    let rx = Random.next(0, 1);
    //    let ry = Random.next(0, 1);

    //    if (rx === 0) {
    //        rx = -1;
    //    }
    //    if (ry === 0) {
    //        ry = -1;
    //    }

    //    this.color[i] = `hsla(${h},${s}%,${v}%,${a})`;
    //    this.dx[i] = rx * Random.next(5, 10);
    //    this.dy[i] = ry * Random.next(5, 10);
    //    this.x[i] = window.innerWidth / 2 + Random.next(-window.innerWidth / 2, window.innerWidth / 2);
    //    this.y[i] = window.innerHeight / 2 + Random.next(-window.innerHeight / 2, window.innerHeight / 2);
    //    this.r[i] = Random.next(2, 3) + Random.nextDouble();
    // }

    public update(deltaTime: number): void {
        const canvas = this.canvas;

        for (let i = 0; i < this.bubbleCount; i++) {
            const x = this.x[i];
            const y = this.y[i];
            const dx = this.dx[i];
            const dy = this.dy[i];

            this.x[i] += this.dx[i] * deltaTime;
            this.y[i] += this.dy[i] * deltaTime;

            if (this.x[i] <= 0 || window.innerWidth <= this.x[i]) {
                this.dx[i] *= -1;
            }
            if (this.y[i] <= 0 || window.innerHeight <= this.y[i]) {
                this.dy[i] *= -1;
            }

            canvas.beginPath();
            canvas.fillStyle = this.color[i];
            canvas.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI * 2, true);
            canvas.fill();
        }
    }
}

/**
*サークルアートの制御と描画を提供します。
*/
class Circle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    r: number;
    color: string;
    canvas: CanvasRenderingContext2D;

    constructor(canvas: CanvasRenderingContext2D) {
        this.canvas = canvas;

        const h = Random.next(0, 360);
        const s = Random.next(80, 100);
        const v = Random.next(50, 80);

        const a = Random.next(50, 80) * 0.01;

        this.color = `hsla(${h},${s}%,${v}%,${a})`;

        let rx = Random.next(0, 1);
        let ry = Random.next(0, 1);

        if (rx === 0) {
            rx = -1;
        }
        if (ry === 0) {
            ry = -1;
        }

        this.dx = rx * Random.next(5, 10);
        this.dy = ry * Random.next(5, 10);
        this.x = window.innerWidth / 2 + Random.next(-window.innerWidth / 2, window.innerWidth / 2);
        this.y = window.innerHeight / 2 + Random.next(-window.innerHeight / 2, window.innerHeight / 2);
        this.r = Random.next(6, 12) + Random.nextDouble();
    }

    public init(): void {
        // float h = (float)(Random.next(180, 220));
        // float s = (float)(Random.next(50, 100));
        // float v = (float)(Random.next(50, 100));

        // byte a = (byte)Random.next(50, 80);

    }

    public update(deltaTime: number): void {
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;

        if (this.x < 0 || this.y < 0 || window.innerWidth < this.x || window.innerHeight < this.y) {
            this.init();
        }
        const canvas = this.canvas;
        canvas.beginPath();
        canvas.fillStyle = this.color;
        canvas.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        canvas.fill();
    }
}

export class CircleArtEngine {
    canvas: CanvasRenderingContext2D;
    circles: Circle[] = [];
    circleCount = 0;

    /**
     * コンストラクタ
     * @param canvas コンテキスト
     * @param circleCount サークルの数
     */
    constructor(canvas: CanvasRenderingContext2D, circleCount: number) {
        this.canvas = canvas;
        this.circleCount = circleCount;
        for (let i = 0; i < circleCount; i++) {
            this.circles.push(new Circle(canvas));
        }
    }

    /**
     * 描画
     * @param speed サークルの移動速度
     */
    update(speed: number): void {
        for (let i = 0; i < this.circleCount; i++) {
            this.circles[i].update(speed);
        }
    }
}

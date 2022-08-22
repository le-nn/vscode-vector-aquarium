export class Particle {
    x: number;
    y: number;
    public static w = 0;
    public static h = 0;
    speed: number;
    vector: any;
    radius: number;
    color: any;
    directionAngle: number;
    drawArea: any;

    constructor(opts: any, drawArea: any) {
        this.x = Math.random() * Particle.w;
        this.y = Math.random() * Particle.h;
        this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
        this.directionAngle = Math.floor(Math.random() * 360);
        this.color = opts.particleColor;
        this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
        this.vector = {
            x: Math.cos(this.directionAngle) * this.speed,
            y: Math.sin(this.directionAngle) * this.speed
        };
        this.drawArea = drawArea;
    }

    dist(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    normalize(x: number, y: number) {
        const distance = Math.sqrt(x * x + y * y);
        return {
            x: x / distance,
            y: y / distance
        };
    }

    update(x: number, y: number) {
        this.x += this.vector.x;
        this.y += this.vector.y;

        const dist = this.dist(x, y, this.x, this.y);
        if (dist <= 200) {
            const vx = x - this.x;
            const vy = y - this.y;
            const nor = this.normalize(vx, vy);
            this.x -= nor.x * (1 - dist / 200) * 3;
            this.y -= nor.y * (1 - dist / 200) * 3;
        }

        this.border();
    }

    border() {
        if (this.x >= Particle.w || this.x <= 0) {
            this.vector.x *= -1;
        }
        if (this.y >= Particle.h || this.y <= 0) {
            this.vector.y *= -1;
        }
        if (this.x > Particle.w) this.x = Particle.w;
        if (this.y > Particle.h) this.y = Particle.h;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
    }

    draw() {
        this.drawArea.beginPath();
        this.drawArea.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.drawArea.closePath();
        this.drawArea.fillStyle = this.color;
        this.drawArea.fill();
    }
}

export class Geometory {
    delay = 200;
    tid: any;
    rgb: string;
    canvasBody: HTMLCanvasElement;
    drawArea: CanvasRenderingContext2D;
    particles: Particle[] = [];
    w?: number;
    h?: number;

    particleCount = 80;
    jointDistance = 80;

    mouse?: MouseEvent;

    opts: any = {
        particleColor: "rgba(38, 166, 154, 0.25)",
        lineColor: "rgb(38, 166, 154)",
        particleAmount: 600,
        defaultSpeed: 0.1,
        variantSpeed: 0.1,
        defaultRadius: 0.5,
        variantRadius: 0.5,
        linkRadius: 120
    };

    constructor(element: HTMLCanvasElement) {
        this.canvasBody = element;
        this.drawArea = element.getContext("2d")!;
        this.rgb = this.opts.lineColor.match(/\d+/g);

        this.resizeReset();
        this.setup();

        window.addEventListener("resize", () => {
            this.setup();
            this.resizeReset();
        });

        document.body.addEventListener("mousemove", (e) => {
            this.mouse = e;
        });

        window.requestAnimationFrame(this.draw.bind(this));
    }

    setup() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.opts, this.drawArea));
        }
    }

    draw() {
        window.requestAnimationFrame(this.draw.bind(this));
        this.drawArea.clearRect(0, 0, this.w!, this.h!);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.mouse!.x, this.mouse!.y);
            this.particles[i].draw();
        }
        for (let i = 0; i < this.particles.length; i++) {
            this.linkPoints(this.particles[i].x, this.particles[i].y, this.particles);
        }
        this.linkPoints(this.mouse!.x, this.mouse!.y, this.particles);
    }

    resizeReset() {
        this.w = this.canvasBody.width = window.innerWidth;
        this.canvasBody.style.width = `${window.innerWidth}px`;
        this.h = this.canvasBody.height = this.canvasBody.clientHeight;

        // 画面サイズに応じて数や結合距離を変更
        this.particleCount = this.opts.particleAmount * (window.innerWidth / 1920);
        this.particleCount *= (this.canvasBody.clientHeight / 1080) * 0.85 + 0.15;
        this.jointDistance = this.opts.linkRadius;

        Particle.w = this.w;
        Particle.h = this.h;
    }

    checkDistance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    linkPoints(x: number, y: number, hubs: any[]) {
        for (let i = 0; i < hubs.length; i++) {
            const distance = this.checkDistance(x, y, hubs[i].x, hubs[i].y);
            const opacity = 1 - distance / this.jointDistance;
            if (opacity > 0) {
                this.drawArea.lineWidth = 1;
                this.drawArea.strokeStyle = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, ${opacity * 0.25})`;
                this.drawArea.beginPath();
                this.drawArea.moveTo(x + 0.5, y + 0.5);
                this.drawArea.lineTo(hubs[i].x + 0.5, hubs[i].y + 0.5);
                this.drawArea.closePath();
                this.drawArea.stroke();
            }
        }
    }
}

/**
 * Represents color.
 */
export class Color {
    r = 0;
    g = 0;
    b = 0;
    a = 1;

    /**
     * get as css
     */
    get rgba(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    // #region public methods
    // constructor(hex: string, alpha?: number)
    // constructor(hsv: number[], alpha?: number);
    // constructor(r: number, g: number, b: number);
    // constructor(r: number, g: number, b: number, a: number);
    constructor();
    constructor(r: number, g: number, b: number, a?: number);
    constructor(r: string, alpha?: number);
    constructor(r?: string | number, g?: number, b?: number, a?: number) {
        if (typeof (r) === "string") {
            if (r.length !== 7 || r[0] !== "#") {
                throw new Error(`Invalid color code ${r}.`);
            }
            const code = r;
            this.r = parseInt(code.slice(1, 3), 16) & 255;
            this.g = parseInt(code.slice(3, 5), 16) & 255;
            this.b = parseInt(code.slice(5, 7), 16) & 255;
            this.a = g || 1;
        }
        else if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a || 1;
        }
        else {
            throw new Error(`Invalid color of (${r},${g},${b},${a})`);
        }
    }

    public static fromHsv(h: number, s: number, v: number, a = 1): Color {
        h = (h < 0 ? h % 360 + 360 : h) % 360 / 60;
        s = s < 0 ? 0 : s > 1 ? 1 : s;
        v = v < 0 ? 0 : v > 1 ? 1 : v;

        // HSV to RGB
        const c = [5, 3, 1].map(function (i) {
            return Math.round((v - Math.max(0, Math.min(1, 2 - Math.abs(2 - (h + i) % 6))) * s * v) * 255);
        });

        return new Color(
            c[0],
            c[1],
            c[2],
            a
        );
    }

    toHsv() {
        let r = this.r;
        let g = this.g;
        let b = this.b;

        let tmp = [r, g, b];
        if (r !== undefined && g === undefined) {
            const cc = parseInt(r.toString().replace(/[^\da-f]/ig, '').replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3"), 16);
            tmp = [cc >> 16 & 0xff, cc >> 8 & 0xff, cc & 0xff];
        }
        else {
            for (let i in tmp) tmp[i] = Math.max(0, Math.min(255, Math.floor(tmp[i])));
        }
        r = tmp[0];
        g = tmp[1];
        b = tmp[2];

        // RGB to HSV
        const
            v = Math.max(r, g, b), d = v - Math.min(r, g, b),
            s = v ? d / v : 0, a = [r, g, b, r, g], i = a.indexOf(v),
            h = s ? (((a[i + 1] - a[i + 2]) / d + i * 2 + 6) % 6) * 60 : 0;

        return { h: h, s: s, v: v / 255, a: this.a };
    }


    public static fromColorCode(code: string, alpha = 1) {
        return new Color(code, alpha);
    }

    /**
     * Convert to hex.
     */
    public toHexString() {
        return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
    }
}

import { Vector2D } from "./Vector2D";

export namespace Numerics {
    export const PI2 = 3.14159265359;
    export const PI_TIMES_TWO2 = 6.28318530718;
    export const PI = 3.14159265359;
    export const PI_TIMES_TWO = 6.28318530718;

    // eslint-disable-next-line no-inner-declarations
    export function lerp(a: number, b: number, lerpFactor: number): number {
        const result = ((1.0 - lerpFactor) * a) + (lerpFactor * b);
        return result;
    }

    // eslint-disable-next-line no-inner-declarations
    export function rotate(vector: Vector2D, radian: number): Vector2D {
        return new Vector2D(
            vector.x * Math.cos(radian) - vector.y * Math.sin(radian),
            vector.x * Math.sin(radian) + vector.y * Math.cos(radian)
        );
    }

    // eslint-disable-next-line no-inner-declarations
    export function lerpAngle(a: number, b: number, lerpFactor: number): number {
        let result = 0;
        const diff = b - a;

        if (diff < -PI) {
            // lerp upwards past PI_TIMES_TWO
            b += PI_TIMES_TWO;

            result = lerp(a, b, lerpFactor);

            if (result >= PI_TIMES_TWO) {
                result -= PI_TIMES_TWO;
            }
        }

        else if (diff > PI) {
            // lerp downwards past 0
            b -= PI_TIMES_TWO;

            result = lerp(a, b, lerpFactor);

            if (result < 0) {
                result += PI_TIMES_TWO;
            }
        }

        else {
            // straight lerp
            result = lerp(a, b, lerpFactor);
        }

        return result;
    }

    // eslint-disable-next-line no-inner-declarations
    export function toRadians(angle: number) {
        return (PI / 180) * angle;
    }

    // eslint-disable-next-line no-inner-declarations
    export function toAngle(radian: number) {
        return radian * 180 / PI;
    }

    // eslint-disable-next-line no-inner-declarations
    export function dist(p1: Vector2D, p2: Vector2D) {
        return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
    }

    // eslint-disable-next-line no-inner-declarations
    export function normalize(a: Vector2D) {
        const distance = Math.sqrt(a.x * a.x + a.y * a.y);
        if (distance === 0) {
            return new Vector2D(0, 0);
        }

        return new Vector2D(a.x / distance, a.y / distance);
    }
}

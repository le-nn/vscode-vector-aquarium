import { useEffect, useRef, useState } from "react";
import * as React from "react";
import useResizeObserver from "use-resize-observer";
import { MousePressedEvent } from "./libs/core/MouseEvent";
import { Vector2D } from "./libs/core/Vector2D";

type Size = { width: number, height: number };

interface CanvasProps {
    width: string;
    height: string;
    resized: (size: Size) => void;
    initialized: (context: CanvasRenderingContext2D, width: number, height: number) => void;

    pointerDownHandler?: (point: MousePressedEvent) => void;
    pointerUpHandler?: (point: MousePressedEvent) => void;
    pointerMoveHandler?: (e: {
        point: Vector2D,
        movement: Vector2D
    }) => void;
}

const scale = () => typeof window !== "undefined" ? window.devicePixelRatio : 1;

export const Canvas = (props: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { ref, width, height } = useResizeObserver<HTMLCanvasElement>();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!width) {
            return;
        }

        const canvasEl = canvasRef.current;
        if (canvasEl) {
            const ctx = canvasEl.getContext("2d");
            ctx?.scale(scale(), scale());

            if (!isInitialized.current) {
                isInitialized.current = true;
                if (ctx) {
                    props.initialized?.(
                        ctx,
                        width ?? 0,
                        height ?? 0
                    );
                }
            }

        }
        else {
            throw new Error("The canvas element couldn't be initialized.");
        }
    }, [width, height]);

    useEffect(() => {
        props.resized({
            width: width ?? 0,
            height: height ?? 0
        });
    }, [width, height]);

    // pointer events
    useEffect(() => {
        if (props.pointerDownHandler) {
            const handle = (e: PointerEvent) => {
                if (props.pointerDownHandler && canvasRef.current) {
                    const canvas = canvasRef.current.getBoundingClientRect();
                    props.pointerDownHandler({
                        position: {
                            x: e.x - canvas.x,
                            y: e.y - canvas.y,
                        }
                    });
                }
            };
            window.addEventListener("pointerdown", handle);
            return () => window.removeEventListener("pointerdown", handle);
        }
    }, [props.pointerDownHandler]);

    useEffect(() => {
        if (props.pointerUpHandler) {
            const handle = (e: PointerEvent) => {
                if (props.pointerUpHandler) {
                    props.pointerUpHandler({
                        position: {
                            x: e.x,
                            y: e.y,
                        }
                    });
                }
            };
            window.addEventListener("pointerup", handle);
            return () => window.removeEventListener("pointerup", handle);
        }
    }, [props.pointerUpHandler]);

    useEffect(() => {
        if (props.pointerMoveHandler) {
            const handle = (e: PointerEvent) => {
                if (props.pointerMoveHandler && canvasRef.current) {
                    const canvas = canvasRef.current.getBoundingClientRect();
                    props.pointerMoveHandler({
                        point: {
                            x: e.x - canvas.x,
                            y: e.y - canvas.y,
                        },
                        movement: {
                            x: e.movementX,
                            y: e.movementY,
                        }
                    });
                }
            };
            window.addEventListener("pointermove", handle);
            return () => window.removeEventListener("pointermove", handle);
        }
    }, [props.pointerMoveHandler]);

    return (
        <div
            ref={ref as any}
            style={{
                width: props.width,
                height: props.height,
            }}>
            <canvas
                style={{
                    width: props.width,
                    height: props.height,
                }}
                ref={canvasRef}
                width={(width ?? 0) * scale()}
                height={(height ?? 0) * scale()}

            />
        </div>
    );
};
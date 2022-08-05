import * as React from "react";
import { BoidController } from "./aquariam/BoidController";
import { Color } from "./aquariam/core/Color";
import { DrawableActor } from "./aquariam/core/DrawableActor";
import { MousePressedEvent } from "./aquariam/core/MouseEvent";
import { Random } from "./aquariam/core/Random";
import { Scene } from "./aquariam/core/Scene";
import { Vector2D } from "./aquariam/core/Vector2D";
import { Fish } from "./aquariam/Fish";
import { FoodProvider } from "./aquariam/FoodProvider";
import { Jellyfish } from "./aquariam/JellyFish";
import { Lophophorata } from "./aquariam/Lophophorata";
import { Renderer } from "./aquariam/Renderer";
import { RippleServer } from "./aquariam/RippleServer";
import { TargetTrackingController } from "./aquariam/TargetTrackingController";
import { Coloney } from "./Colony";

const create = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const scene = new Scene(width, height, new Renderer(context));
    scene.append(new FoodProvider());

    scene.append(new RippleServer());
    scene.append(
        new DrawableActor(
            new Lophophorata(Random.getRandomColor()),
            { location: new Vector2D(120, 200) }
        )
    );

    scene.append(
        new TargetTrackingController(
            new DrawableActor(
                new Jellyfish(Random.getRandomColor()),
                { location: new Vector2D(240, 280) }
            ),
            6
        )
    );

    scene.append(
        new TargetTrackingController(
            new DrawableActor(
                new Jellyfish(Random.getRandomColor()),
                { location: new Vector2D(120, 360) }
            ),
            6
        )
    );

    scene.append(
        new TargetTrackingController(
            new DrawableActor(
                new Jellyfish(Random.getRandomColor()),
                { location: new Vector2D(220, 500) }
            ),
            6
        )
    );

    for (const code of [
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
    ]) {
        const c = Color.fromColorCode(code);

        const boid = new BoidController(
            new DrawableActor(
                new Fish(c),
                { location: new Vector2D(0, 0) }
            )
        );
        scene.append(boid);

        for (let j = 0; j < Random.next(2, 5); j++) {
            const b = new TargetTrackingController(
                new DrawableActor(
                    new Fish(c),
                    { location: new Vector2D(0, 0) }
                ),
            );
            boid.addBoid(b);
        }
    }

    scene.begin();

    return scene;
};

export const Main = () => {
    const [scene, setScene] = React.useState<Scene | null>(null);

    const handlePointerDown = (e: MousePressedEvent) => {
        scene?.press(e);
    };

    const handleInitialized = (context: CanvasRenderingContext2D, width: number, height: number) => {
        setScene(create(context, width, height));
    };

    return (
        <div
            style={{
                height: "100%",
                width: "100%"
            }}
        >
            <Coloney width={"100%"} height={"100%"}
                pointerDownHandler={handlePointerDown}
                resized={s => {
                    if (scene) {
                        scene.width = s.width;
                        scene.height = s.height;
                    }
                }}
                initialized={handleInitialized}
            />
        </div>
    );
};

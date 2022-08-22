import * as React from "react";
import { BoidController } from "./aquariam/BoidController";
import { Actor } from "./aquariam/core/Actor";
import { Color } from "./aquariam/core/Color";
import { DrawableActor } from "./aquariam/core/DrawableActor";
import { EmptyActor } from "./aquariam/core/EmptyActor";
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
import { setting } from "./DefaultSetting";

const colors = [
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
]

const create = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const scene = new Scene(width, height, new Renderer(context));
    scene.begin();

    return scene;
};

const initScene = (scene: Scene) => {
    if (setting.isFoodEnabled) {
        scene.append(new FoodProvider());
    }

    if (setting.isRippleEnabled) {
        scene.append(new RippleServer());
    }

    for (const i of setting.lophophorata) {
        scene.append(
            new DrawableActor(
                new Lophophorata(Color.fromColorCode(i.color ?? "#aaaaaa")),
                {
                    location: new Vector2D(i.location?.x ?? 0, i.location?.y ?? 0),
                    scale: i.scale ?? 1,
                    angle: i.angle ?? 0,
                }
            )
        );
    }

    for (const i of setting.jerryfish) {
        scene.append(
            new TargetTrackingController(
                new DrawableActor(
                    new Jellyfish(Color.fromColorCode(i.color ?? "#aaaaaa")),
                    {
                        location: new Vector2D(i.location?.x ?? 0, i.location?.y ?? 0),
                        scale: i.scale ?? 1,
                        angle: i.angle ?? 0,
                    }
                ),
                6
            )
        );
    }

    for (const boid of setting.fish) {
        const b = new BoidController(
            new EmptyActor()
        );
        scene.append(b);

        for (const i of boid) {
            const f = new TargetTrackingController(
                new DrawableActor(
                    new Fish(Color.fromColorCode(i.color ?? "#aaaaaa")),
                    {
                        location: new Vector2D(i.location?.x ?? 0, i.location?.y ?? 0),
                        scale: i.scale ?? 1,
                        angle: i.angle ?? 0,
                    }
                )
            );

            b.addBoid(f);
        }
    }

}

export const Main = () => {
    const [scene, setScene] = React.useState<Scene | null>(null);

    const handlePointerDown = (e: MousePressedEvent) => {
        scene?.press(e);
    };

    const handleInitialized = (context: CanvasRenderingContext2D, width: number, height: number) => {
        const scene=create(context, width, height);
        setScene(scene);
        initScene(scene);
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

import * as React from "react";
import { Scene } from "./libs/core/Scene";
import { Renderer } from "./libs/utils/HtmlCanvasRenderer";
import { Canvas } from "./Canvas";
import { defaultSettings, } from "./libs/aquarium/defaultSettings";
import { MousePressedEvent } from "./libs/core/MouseEvent";
import {  AquariumSetting } from "./libs/aquarium/Setting";
import { createAquarium } from "./libs/aquarium";

// Merge settings
const finalSetting: AquariumSetting = {
    ...defaultSettings,
    ...((window as any)?.setting ?? {})
}

const create = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const scene = new Scene(width, height, new Renderer(context))
    scene.begin()
    return scene
}

export const Main = () => {
    const [scene, setScene] = React.useState<Scene | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handlePointerDown = (e: MousePressedEvent) => {
        scene?.press(e);
    };

    const handleInitialized = (context: CanvasRenderingContext2D, width: number, height: number) => {
        try {
            const scene = create(context, width, height);
            setScene(scene);
            createAquarium(scene, finalSetting);
        }
        catch (ex: any) {
            setError(ex.message ?? "An error occurred");
        }
    };

    return (
        <div
            style={{
                height: "100%",
                width: "100%"
            }}
        >
            {error
                ? <div style={{ padding: "20px" }}>
                    Oops...! something went wrong<br />
                    Message: {error}
                </div>
                : <Canvas width={"100%"} height={"100%"}
                    pointerDownHandler={handlePointerDown}
                    resized={s => {
                        if (scene) {
                            scene.width = s.width;
                            scene.height = s.height;
                        }
                    }}
                    initialized={handleInitialized}
                />
            }
        </div>
    );
};

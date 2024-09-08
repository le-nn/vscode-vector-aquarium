import { Scene } from "./core/Scene";
import { HtmlCanvasRenderer } from "./utils/HtmlCanvasRenderer";
import { defaultSettings, } from "./aquarium/defaultSettings";
import { MousePressedEvent } from "./core/MouseEvent";
import { AquariumSetting } from "./aquarium/Setting";
import { createAquarium } from "./aquarium";
import { animationFrame } from "./utils/animationFrame";

export {
    Scene,
    HtmlCanvasRenderer,
    defaultSettings,
    createAquarium,
    animationFrame
};

export type {
    MousePressedEvent,
    AquariumSetting
};

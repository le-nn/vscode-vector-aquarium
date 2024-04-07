import { AquariumSetting } from "./Setting";

export const defaultSettings: AquariumSetting = {
    isFoodEnabled: true,
    isRippleEnabled: true,
    rippleColors: [
        "#3f51b5", "#2196f3", "#00bcd4", "#009688", "#4caf50", "#cddc39",
        "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#f44336", "#e91e63", "#9c27b0"
    ],
    foodColors: [
        "#3f51b5", "#2196f3", "#00bcd4", "#009688", "#4caf50", "#cddc39",
        "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#f44336", "#e91e63", "#9c27b0"
    ],
    actors: [
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#3f51b5", }, autoAddCount: 5, },
        { type: "boid", speed: 100, autoAddTemplate: { type: "fish", "color": "#2196f3" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#00bcd4" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#009688" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#4caf50" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#cddc39" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#ffeb3b" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#ffc107" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#ff9800" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#ff5722" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#ff5722" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#f44336" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#e91e63" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { type: "fish", "color": "#9c27b0" }, autoAddCount: 5, },
        { type: "fish", color: "#00bcd4", scale: 1.2 },
        { type: "jerryfish", color: "#9c27b0", scale: 1, },
        { type: "jerryfish", color: "#e91e63", scale: 0.88, },
        { type: "jerryfish", color: "#00bcd4", scale: 0.79, speed: 10 },
        { type: "jerryfish", color: "#cddc39", scale: 0.9, },
        { type: "jerryfish", color: "#ff5722", scale: 1.2, },
        { type: "lophophorata", color: "#3f51b5", scale: 1, location: { x: 120, y: 200 } },
    ],
}


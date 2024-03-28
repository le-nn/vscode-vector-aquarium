export const setting: Setting = {
    isFoodEnabled: true,
    isRippleEnabled: true,
    rippleColors:[
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
    ],
    foodColors:[
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
    ],
    actors: [
        { type: "boid", autoAddTemplate: { type: "fish","color": "#3f51b5" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#2196f3" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#00bcd4" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#009688" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#4caf50" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#cddc39" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#ffeb3b" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#ffc107" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#ff9800" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#ff5722" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#ff5722" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#f44336" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#e91e63" }, autoAddCount: 5, },
        { type: "boid", autoAddTemplate: { "color": "#9c27b0" }, autoAddCount: 5, },
        { type: "fish", color: "#00bcd4", scale: 1.4 },
        { type: "jerryfish", color: "#9c27b0", scale: 1, },
        { type: "jerryfish", color: "#e91e63", scale: 0.88, },
        { type: "jerryfish", color: "#00bcd4", scale: 0.79, },
        { type: "jerryfish", color: "#cddc39", scale: 0.9, },
        { type: "jerryfish", color: "#ff5722", scale: 1.2, },
        { type: "lophophorata", color: "#3f51b5", scale: 1, location: { x: 120, y: 200 } },
    ],
}

type Setting = {
    isFoodEnabled: boolean
    isRippleEnabled: boolean
    rippleColors?: string[]

    foodColors?: string[]

    actors?: ActorOrBoid[]

    /**
     * @deprecated
     */
    fish?: (Actor | Actor[])[]

    /**
     * @deprecated
     */
    jerryfish?: Actor[]

    /**
     * @deprecated
     */
    lophophorata?: Actor[]
}

type Actor = {
    type?: "lophophorata" | "jerryfish" | "fish"
    color?: string
    location?: { x: number, y: number }
    scale?: number
    angle?: number
}

export type ActorOrBoid = Boid | Actor

type Boid = {
    type: "boid"
    speed?: number
    children?: Actor[]
    autoAddTemplate?: Actor
    autoAddCount?: number
}


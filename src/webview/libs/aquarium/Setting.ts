export type AquariumSetting = {
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

export type Actor = {
    type?: "lophophorata" | "jerryfish" | "fish"
    color?: string
    location?: { x: number, y: number }
    scale?: number
    speed?: number
    angle?: number
}

export type ActorOrBoid = Boid | Actor

export type Boid = {
    type: "boid"
    speed?: number
    children?: Actor[]
    autoAddTemplate?: Actor
    autoAddCount?: number
}

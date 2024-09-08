import { Scene } from "../core/Scene"
import { Jellyfish } from "./Jellyfish"
import { Lophophorata } from "./Lophophorata"
import { ActorOrBoid, AquariumSetting } from "./Setting"
import { Vector2D } from "../core/Vector2D"
import { Fish } from "./Fish"
import { Boid } from "./Boid"
import { Random } from "../core/Random"
import { FoodProvider } from "./FoodProvider"
import { RippleServer } from "./RippleServer"
import { Color } from "../core/Color"

export const createAquarium = (scene: Scene, finalSetting: AquariumSetting) => {
    if (finalSetting.isFoodEnabled) {
        scene.instantiate(new FoodProvider(finalSetting.foodColors))
    }

    if (finalSetting.isRippleEnabled) {
        scene.instantiate(new RippleServer(finalSetting.rippleColors))
    }

    for (const actor of finalSetting.actors ?? []) {
        const defaultLocation = new Vector2D(
            Random.next(scene?.width ?? 0),
            Random.next(scene?.height ?? 0)
        )

        if (actor.type === "boid") {
            const b = scene.instantiate(new Boid())

            if (actor.autoAddTemplate?.location) {
                b.location = new Vector2D(
                    actor.autoAddTemplate?.location?.x ?? defaultLocation.x,
                    actor.autoAddTemplate?.location?.y ?? defaultLocation.y
                )
            }

            b.boss.speed = Number(actor.speed ?? 1)

            // Add child actors
            for (const child of actor.children ?? []) {
                const childInstance = createActor(child, defaultLocation)
                if (childInstance) {
                    childInstance.location.x += Random.next(100)
                    childInstance.location.y += Random.next(100)
                    b.addBoid(scene.instantiate(childInstance))
                }
            }

            // Auto add
            for (let i = 0; i < (actor.autoAddCount ?? 0); i++) {
                if (actor.autoAddTemplate) {
                    const template = createActor(actor.autoAddTemplate, defaultLocation)
                    if (template) {
                        template.location.x += Random.next(100)
                        template.location.y += Random.next(100)
                        b.addBoid(scene.instantiate(template));
                    }
                }
            }

        }
        else {
            const actorInstance = createActor(actor, defaultLocation)
            if (actorInstance) {
                scene.instantiate(actorInstance)
            }
        }
    }

    initDeprecateds(scene, finalSetting);
}

const createActor = (actor: ActorOrBoid | null, defaultLocation: Vector2D) => {
    if (!actor) {
        return null
    }

    switch (actor.type) {
        case "boid":
            return null
        case "lophophorata":
            return new Lophophorata(
                Color.fromColorCode(actor.color ?? "#aaaaaa"),
                {
                    location: new Vector2D(actor.location?.x ?? defaultLocation.x, actor.location?.y ?? defaultLocation.y),
                    scale: actor.scale ?? 1,
                    angle: actor.angle ?? Random.next(0, 360),
                }
            )
        case "fish":
            return new Fish(
                Color.fromColorCode(actor.color ?? "#aaaaaa"),
                actor.speed,
                {
                    location: new Vector2D(actor.location?.x ??  defaultLocation.x, actor.location?.y ?? defaultLocation.y),
                    scale: actor.scale ?? 1,
                    angle: actor.angle ?? Random.next(0, 360),
                }
            )
        case "jerryfish":
            return new Jellyfish(
                Color.fromColorCode(actor.color ?? "#aaaaaa"),
                actor.speed,
                {
                    location: new Vector2D(actor.location?.x ??  defaultLocation.x, actor.location?.y ?? defaultLocation.y),
                    scale: actor.scale ?? 1,
                    angle: actor.angle ?? Random.next(0, 360),
                }
            )
        default: {
            return new Fish(
                Color.fromColorCode(actor.color ?? "#aaaaaa"),
                actor.speed,
                {
                    location: new Vector2D(actor.location?.x ??  defaultLocation.x, actor.location?.y ?? defaultLocation.y),
                    scale: actor.scale ?? 1,
                    angle: actor.angle ?? Random.next(0, 360),
                }
            )
        }
    }
}

/**
 * Init deprecated json params
 * @deprecated
 */
const initDeprecateds = (scene: Scene, finalSetting: AquariumSetting) => {
    for (const i of finalSetting.lophophorata ?? []) {
        scene.instantiate(
            new Lophophorata(
                Color.fromColorCode(i.color ?? "#aaaaaa"),
                {
                    location: new Vector2D(i.location?.x ?? 0, i.location?.y ?? 0),
                    scale: i.scale ?? 1,
                    angle: i.angle ?? 0,
                }
            )
        )
    }

    for (const i of finalSetting.jerryfish ?? []) {
        scene.instantiate(
            new Jellyfish(
                Color.fromColorCode(i.color ?? "#aaaaaa"),
                null,
                {
                    location: new Vector2D(i.location?.x ?? 0, i.location?.y ?? 0),
                    scale: i.scale ?? 1,
                    angle: i.angle ?? 0,
                }
            )
        )
    }

    for (const fishes of finalSetting.fish ?? []) {
        if (Array.isArray(fishes)) {
            const b = scene.instantiate(new Boid())
            for (const fish of fishes) {
                b.addBoid(
                    scene.instantiate(
                        new Fish(
                            Color.fromColorCode(fish.color ?? "#aaaaaa"),
                            null,
                            {
                                location: new Vector2D(
                                    fish.location?.x ?? 0,
                                    fish.location?.y ?? 0
                                ),
                                scale: fish.scale ?? 1,
                                angle: fish.angle ?? 0,
                            }
                        )
                    )
                )
            }
        }
        else {
            scene.instantiate(
                new Fish(
                    Color.fromColorCode(fishes.color ?? "#aaaaaa"),
                    null,
                    {
                        location: new Vector2D(
                            fishes.location?.x ?? 0,
                            fishes.location?.y ?? 0
                        ),
                        scale: fishes.scale ?? 1,
                        angle: fishes.angle ?? 0,
                    }
                )
            )
        }
    }
}

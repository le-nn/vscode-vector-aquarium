class Utility {
    public static ShuffleArray<T>(array: T[]): T[] {
        return [];
    }
}

export enum CurtainDeleyType {
    Shuffle,
    Order
}

export class Curtain {
    /**
     * parent element
     */
    private parent: HTMLElement;

    /**
     * appended children
     */
    private children: HTMLElement[] = [];

    /**
     * colors to apply
     */
    private colors: string[] = [];

    /**
     * animation time in seconds
     */
    private timeSeconds = 0;

    /**
     * initial parent height
     */
    private parentInitHeight: string | null;

    /**
     * curtain edge radius px
     */
    private radius = 0;

    /**
     * コンストラクタ.colorsの要素数だけカーテンを生成します.
     * @param element
     * @param colors
     * @param timeSeconds
     * @param radius
     */
    public constructor(
        element: HTMLElement,
        timeSeconds = 0,
        colors: string[] = [
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
        radius = 0) {
        if (!element) {
            throw new Error("HTMLElement is not specified");
        }
        this.parent = element;
        this.colors = colors;
        this.timeSeconds = timeSeconds;
        this.radius = radius;
        this.parentInitHeight = element.style.height;
    }

    /**
     * Initialize the parent element and append the curtain item to children.
     */
    public init(curtainHeight = 100, curtainDelayType: CurtainDeleyType = CurtainDeleyType.Shuffle) {
        // one curtain item width
        const parentWidth = this.parent.getBoundingClientRect().width;
        const itemWidth = parentWidth / this.colors.length;

        const itemDelay = this.timeSeconds / this.colors.length;
        const itemDelays: number[] = [];

        if (curtainDelayType === CurtainDeleyType.Shuffle) {
            for (let i = 0; i < this.colors.length; i++) {
                itemDelays.push(itemDelay + Math.random());
            }
        }
        else {
            for (let i = 0; i < this.colors.length; i++) {
                itemDelays.push(itemDelay * 1);
            }
        }

        this.parent.style.display = "flex";
        for (const item of this.colors) {
            const div = document.createElement("div");
            // apply styles
            div.style.background = item;
            div.style.width = itemWidth + "px";
            div.style.height = `${curtainHeight}%`;

            div.style.transition = `all ${this.timeSeconds}s cubic-bezier(1.000, 0.645, 0.425, 0.850)`;
            div.style.webkitTransition = `all ${this.timeSeconds}s cubic-bezier(1.000, 0.645, 0.425, 0.850)`;
            div.style.transitionDelay = `${itemDelays.shift()}s`;
            div.style.borderRadius = `0 0 ${this.radius}px ${this.radius}px`;
            div.style.zIndex = "10000";

            div.classList.add("material-shadow");

            this.children.push(div);
            this.parent.appendChild(div);
        }
    }

    /**
     * Set and Play curtain animation.
     * @param curtainHeight 0-100% curtain height
     */
    public play(curtainHeight = 0) {
        for (const item of this.children) {
            item.style.height = `${curtainHeight}%`;
        }
    }
}

class BaseObject {
    public name: string;
    public width: number;
    public height: number;
    public sprite: HTMLImageElement;
    public needsToRender: boolean;
    public x: number;
    public y: number;
    public frame: number;
    public maxFrame: number;
    private frameTimes: number;
    private lastFrame: number;
    private lastUpdateTime: number;

    constructor(
        name: string,
        width: number,
        height: number,
        x: number,
        y: number,
        sprite: HTMLImageElement,
        frames: number,
        frameTimes: Array<number>
    ) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.maxFrame = frames || null;
        this.frame = 0;

        let fallbackFrames = [];
        for (let i = 0; i < this.maxFrame; i += 1) {
            fallbackFrames.push(1000);
        }

        this.frameTimes = frameTimes || fallbackFrames;
        this.lastUpdateTime = new Date().getTime();
        this.lastFrame = 0;

        this.needsToRender = true;

        this.sprite = sprite;
    }

    public update() {
        let now = new Date().getTime();

        if (now - this.lastUpdateTime >= this.frameTimes[this.frame]) {
            this.lastFrame = now - this.lastUpdateTime;
            this.lastUpdateTime = now;

            if (this.frame + 1 < this.maxFrame) {
                this.frame += 1;
            }
        }
        this.needsToRender = true;
    }
}

export default BaseObject;

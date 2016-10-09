import ObjectManager from '../common/ObjectManager';
import Grid from '../common/Grid';

class CanvasRenderer {
    public canvas: HTMLCanvasElement;
    private context: any;
    private manager: ObjectManager;
    private map: Grid;
    public offset: Array<number>;
    private panSpeed: number;
    private hasScroll: Array<Boolean>;

    constructor(canvas: HTMLCanvasElement, manager: ObjectManager, map: Grid) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.manager = manager;
        this.map = map;

        this.canvas.width = this.map.width * this.map.cellSize;
        this.canvas.height = this.map.height * this.map.cellSize;
        let parent = <HTMLElement>this.canvas.parentNode;
        this.hasScroll = [
            (parent.clientWidth < this.canvas.width ? true : false),
            (parent.clientHeight < this.canvas.height ? true : false)
            ];
        this.offset = [0, 0];
        this.panSpeed = 5;
    }

    public render(renderList: Array<any>) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        renderList.forEach(function (id) {
            let item = this.manager.getById(id);
            let x = item.obj.x + this.offset[0];
            let y = item.obj.y + this.offset[1];
            let sprite = item.obj.sprite;
            let spriteOffset = item.obj.frame * this.map.cellSize;

            this.context.drawImage(
                sprite,
                spriteOffset,
                0,
                this.map.cellSize,
                this.map.cellSize,
                x,
                y,
                this.map.cellSize,
                this.map.cellSize
            );
        }.bind(this));
    }

    public panLeft() {
        if (this.hasScroll[0] && this.offset[0] < 0) {
            this.offset[0] += this.panSpeed;
        }
    }
    public panRight() {
        if (this.hasScroll[0] && this.offset[0] + this.canvas.width > 0) {
            this.offset[0] -= this.panSpeed;
        }
    }
    public panUp() {
        if (this.hasScroll[1] && this.offset[1] < 0) {
            this.offset[1] += this.panSpeed;
        }
    }
    public panDown() {
        if (this.hasScroll[1] && this.offset[1] + this.canvas.height < 0) {
            this.offset[1] -= this.panSpeed;
        }
    }
}

export default CanvasRenderer;

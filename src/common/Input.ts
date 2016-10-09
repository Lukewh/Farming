// import Keybindings from '../config/Keybinding';
import CanvasRenderer from '../rendering/Renderer';
import {getCoordsFromPixels} from './Position';
import Grid from './Grid';
import BaseObject from '../objects/BaseObject';
import ObjectManager from './ObjectManager';
import keybindings from '../config/Keybinding';

interface Movement {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

class Input extends BaseObject {
    private renderer: CanvasRenderer;
    private grid: Grid;
    private manager: ObjectManager;
    private actionButtonActive: boolean;
    private altActionButtonActive: boolean;
    private move: Movement;

    constructor(renderer: CanvasRenderer, grid: Grid, manager: ObjectManager, sprite: HTMLImageElement) {
        super('Input', grid.cellSize, grid.cellSize, 0, 0, sprite, null);
        this.renderer = renderer;
        this.grid = grid;
        this.manager = manager;
        this.actionButtonActive = false;
        this.altActionButtonActive = false;
        this.move = {
            down: false,
            left: false,
            right: false,
            up: false
        };

        this.bindMouse();
        this.bindKeyboard();
    }

    public update() {
        this.needsToRender = true;
        if (this.move.up) {
            this.renderer.panUp();
        } else if (this.move.down) {
            this.renderer.panDown();
        }

        if (this.move.left) {
            this.renderer.panLeft();
        } else if (this.move.right) {
            this.renderer.panRight();
        }
    }

    private bindMouse() {
        this.renderer.canvas.addEventListener('mousemove', function (e) {
            let mousePosition = getCoordsFromPixels(e.offsetX, e.offsetY, this.grid, this.renderer.offset);
            console.log(mousePosition);
            this.x = mousePosition[0] * this.grid.cellSize;
            this.y = mousePosition[1] * this.grid.cellSize;
        }.bind(this));

        this.renderer.canvas.addEventListener('mousedown', this.actionButtonClick.bind(this));

        this.renderer.canvas.addEventListener('mouseup', function (e) {
            if (e.button === 1) {
                this.actionButtonActive = false;
            } else if (e.button === 2) {
                this.altActionButtonActive = true;
            }
        }.bind(this));

        document.addEventListener('contextmenu', function(e){
            e.preventDefault();
        }, false);
    }

    private actionButtonClick() {
        console.log('click');
        this.manager.addObjectFromBlueprint('plantGrass', this.x, this.y);
    }

    private bindKeyboard() {
        window.addEventListener('keydown', function (e) {
            if (e.key === keybindings.moveUp) {
                this.move.up = true;
            } else if (e.key === keybindings.moveDown) {
                this.move.down = true;
            }

            if (e.key === keybindings.moveLeft) {
                this.move.left = true;
            } else if (e.key === keybindings.moveRight) {
                this.move.right = true;
            }
        }.bind(this));

        window.addEventListener('keyup', function (e) {
            if (e.key === keybindings.moveUp) {
                this.move.up = false;
            } else if (e.key === keybindings.moveDown) {
                this.move.down = false;
            }

            if (e.key === keybindings.moveLeft) {
                this.move.left = false;
            } else if (e.key === keybindings.moveRight) {
                this.move.right = false;
            }
        }.bind(this));
    }
}

export default Input;

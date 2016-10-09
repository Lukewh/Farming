"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Position_1 = require('./Position');
var BaseObject_1 = require('../objects/BaseObject');
var Input = (function (_super) {
    __extends(Input, _super);
    function Input(renderer, grid, manager, sprite) {
        _super.call(this, 'Input', grid.cellSize, grid.cellSize, 0, 0, sprite);
        this.renderer = renderer;
        this.grid = grid;
        this.manager = manager;
        this.actionButtonActive = false;
        this.altActionButtonActive = false;
        this.bindMouse();
    }
    Input.prototype.bindMouse = function () {
        this.renderer.canvas.addEventListener('mousemove', function (e) {
            var mousePosition = Position_1.getCoordsFromPixels(e.clientX, e.clientY, this.grid);
            this.x = mousePosition[0] * this.grid.cellSize;
            this.y = mousePosition[1] * this.grid.cellSize;
        }.bind(this));
        this.renderer.canvas.addEventListener('mousedown', this.actionButtonClick.bind(this));
        this.renderer.canvas.addEventListener('mouseup', function (e) {
            if (e.button === 1) {
                this.actionButtonActive = false;
            }
            else if (e.button === 2) {
                this.altActionButtonActive = true;
            }
        }.bind(this));
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, false);
    };
    Input.prototype.actionButtonClick = function () {
        console.log('click');
        this.manager.addBaseObject('Blank', this.grid.cellSize, this.grid.cellSize, this.x, this.y);
    };
    Input.prototype.update = function () {
        this.needsToRender = true;
    };
    return Input;
}(BaseObject_1["default"]));
exports.__esModule = true;
exports["default"] = Input;
//# sourceMappingURL=Input.js.map
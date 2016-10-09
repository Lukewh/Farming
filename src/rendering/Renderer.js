"use strict";
var CanvasRenderer = (function () {
    function CanvasRenderer(canvas, manager) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.manager = manager;
        this.canvas.width = canvas.parentNode.clientWidth;
        this.canvas.height = canvas.parentNode.clientHeight;
    }
    CanvasRenderer.prototype.render = function (renderList) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        renderList.forEach(function (id) {
            var item = this.manager.getById(id);
            var x = item.obj.x;
            var y = item.obj.y;
            var width = item.obj.width;
            var height = item.obj.height;
            var sprite = item.obj.sprite;
            this.context.drawImage(sprite, x, y, width, height);
        }.bind(this));
    };
    return CanvasRenderer;
}());
exports.__esModule = true;
exports["default"] = CanvasRenderer;
//# sourceMappingURL=Renderer.js.map
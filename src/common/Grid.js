"use strict";
var Grid = (function () {
    function Grid(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.grid = [];
        for (var row = 0; row < this.height; row += 1) {
            var columns = [];
            for (var col = 0; col < this.height; col += 1) {
                columns.push(null);
            }
            this.grid.push(columns);
        }
    }
    Grid.prototype.toArray = function () {
        return this.grid;
    };
    return Grid;
}());
exports.__esModule = true;
exports["default"] = Grid;
//# sourceMappingURL=Grid.js.map
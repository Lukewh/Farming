"use strict";
function getCoordsFromPixels(x, y, grid) {
    return [Math.floor(x / grid.cellSize), Math.floor(y / grid.cellSize)];
}
exports.getCoordsFromPixels = getCoordsFromPixels;
//# sourceMappingURL=Position.js.map
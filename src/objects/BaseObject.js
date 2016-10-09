"use strict";
var BaseObject = (function () {
    function BaseObject(name, width, height, x, y, sprite) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.needsToRender = true;
        this.sprite = sprite;
    }
    BaseObject.prototype.update = function () {
        this.needsToRender = true;
    };
    return BaseObject;
}());
exports.__esModule = true;
exports["default"] = BaseObject;
//# sourceMappingURL=BaseObject.js.map
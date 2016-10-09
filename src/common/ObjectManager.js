"use strict";
var AssetLoader_1 = require('./AssetLoader');
var BaseObject_1 = require('../objects/BaseObject');
var ObjectManager = (function () {
    function ObjectManager(assetLoader) {
        this.assetLoader = AssetLoader_1["default"];
        this.list = [];
        this.toRender = [];
        this.assetLoader = assetLoader;
    }
    ObjectManager.prototype.addObject = function (obj) {
        var id = "o" + (this.list.length + 1);
        this.list.push({
            id: id,
            obj: obj
        });
        console.log("added " + id);
    };
    ObjectManager.prototype.addBaseObject = function (name, width, height, x, y) {
        this.addObject(new BaseObject_1["default"](name, width, height, x, y, this.assetLoader.assets['DefaultObject.png']));
    };
    ObjectManager.prototype.getById = function (id) {
        var found = this.list.filter(function (item) {
            return item.id === id;
        });
        if (found.length > 1) {
            console.error('Why more than one with same id?');
        }
        else if (found.length === 1) {
            return found[0];
        }
        return false;
    };
    ObjectManager.prototype.update = function () {
        this.list.forEach(function (item) {
            item.obj.update();
            if (item.obj.needsToRender) {
                this.toRender.push(item.id);
                item.obj.needsToRender = false;
            }
        }.bind(this));
    };
    return ObjectManager;
}());
exports.__esModule = true;
exports["default"] = ObjectManager;
//# sourceMappingURL=ObjectManager.js.map
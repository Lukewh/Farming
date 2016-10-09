"use strict";
var AssetLoader = (function () {
    function AssetLoader() {
        this.assets = {};
    }
    AssetLoader.prototype.loadAssets = function (assetUrls) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            assetUrls.forEach(function (url) {
                promises.push(self.loadSingle(url));
            });
            Promise.all(promises).then(function (val) {
                resolve();
            }, function (reason) {
                reject(reason);
            });
        });
    };
    AssetLoader.prototype.loadSingle = function (url) {
        return new Promise(function (resolve, reject) {
            try {
                var img_1 = new Image();
                img_1.onload = function (e) {
                    this.assets[img_1.src.split('/').pop()] = img_1;
                    resolve(img_1);
                }.bind(this);
                img_1.src = url;
            }
            catch (e) {
                reject(e);
            }
        }.bind(this));
    };
    return AssetLoader;
}());
exports.__esModule = true;
exports["default"] = AssetLoader;
//# sourceMappingURL=AssetLoader.js.map
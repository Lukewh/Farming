class AssetLoader {
    public assets: Object;

    constructor() {
        this.assets = {};
    }

    public loadAssets(assetUrls: Array<string>) {
        const self = this;
        return new Promise(function (resolve, reject) {
            let promises = [];
            assetUrls.forEach(function (url) {
                promises.push(self.loadSingle(url));
            });

            Promise.all(promises).then(function (val) {
                resolve();
            }, function(reason) {
                reject(reason);
            });
        });
    }

    private loadSingle(url) {
        return new Promise(function (resolve, reject) {
           try {
               let img = new Image();
               img.onload = function(e) {
                   this.assets[img.src.split('/').pop()] = img;
                   resolve(img);
               }.bind(this);
               img.src = url;
           } catch (e) {
               reject(e);
           }
        }.bind(this));
    }
}

export default AssetLoader;
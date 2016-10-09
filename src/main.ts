/// <reference path="../DefinitelyTyped/es6-promise.d.ts" />

import Grid from './common/Grid';
import CanvasRenderer from './rendering/Renderer';
import ObjectManager from './common/ObjectManager';
import AssetLoader from './common/AssetLoader';
import Input from './common/Input';

class Main {
    private map: Grid;
    private renderer: CanvasRenderer;
    private manager: ObjectManager;
    private assetLoader: AssetLoader;
    private input: Input;

    constructor() {
        const self = this;
        self.assetLoader = new AssetLoader();

        self.assetLoader.loadAssets([
            './static/resources/DefaultObject.png',
            './static/resources/mousePos.png',
            './static/resources/Grass.png'
        ]).then(function () {
            self.map = new Grid(10, 10, 64);
            self.manager = new ObjectManager(self.assetLoader, self.map);
            self.renderer = new CanvasRenderer(<HTMLCanvasElement>document.querySelector('canvas'), self.manager, self.map);

            self.input = new Input(self.renderer, self.map, self.manager, self.assetLoader.assets['mousePos.png']);

            self.manager.addObject(self.input);

            self.start();
        }, function(reason) {
            console.error(reason);
        });
    }

    public start() {
        this.step();
    }

    private update() {
        this.manager.update();
        this.renderer.render(this.manager.toRender);
        this.manager.toRender = [];
    }

    private step() {
        this.update();

        requestAnimationFrame(this.step.bind(this, null));
    }
}

const app = new Main();
console.log(app);

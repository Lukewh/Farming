import AssetLoader from './AssetLoader';
import BaseObject from '../objects/BaseObject';
import Blueprints from '../config/ObjectBlueprints';
import Grid from './Grid';

class ObjectManager {
    public toRender: Array<any>;
    private assetLoader: AssetLoader;
    private list: Array<any>;
    private grid: Grid;

    constructor(assetLoader: AssetLoader, grid: Grid) {
        this.list = [];
        this.toRender = [];
        this.assetLoader = assetLoader;
        this.grid = grid;
    }

    public addObject(obj: any) {
        let id = `o${this.list.length + 1}`;
        this.list.push({
            id: id,
            obj: obj
        });

        console.log(`added ${id}`);
    }

    public addBaseObject(name: string, width: number, height: number, x: number, y: number) {
        this.addObject(
            new BaseObject(
                name,
                width * this.grid.cellSize,
                height * this.grid.cellSize,
                x,
                y,
                this.assetLoader.assets['DefaultObject.png'],
                null,
                null
            )
        );
    }

    public addObjectFromBlueprint(key: string, x: number, y: number) {
        if (Blueprints[key]) {
            const obj = Blueprints[key];
            this.addObject(
                new BaseObject(
                    obj.name,
                    obj.width * this.grid.cellSize,
                    obj.height * this.grid.cellSize,
                    x,
                    y,
                    this.assetLoader.assets[obj.asset],
                    obj.frames,
                    obj.frameTime
                )
            );
        }
    }

    public getById(id: string): any {
        let found = this.list.filter(function (item) {
            return item.id === id;
        });

        if (found.length > 1) {
            console.error('Why more than one with same id?');
        } else if (found.length === 1) {
            return found[0];
        }
        return false;
    }

    public update() {
        this.list.forEach(function (item) {
            item.obj.update();
            if (item.obj.needsToRender) {
                this.toRender.push(item.id);
                item.obj.needsToRender = false;
            }
        }.bind(this));
    }
}

export default ObjectManager;

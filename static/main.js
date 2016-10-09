(function () {
    'use strict';

    function __extends(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

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

    var CanvasRenderer = (function () {
        function CanvasRenderer(canvas, manager, map) {
            this.canvas = canvas;
            this.context = this.canvas.getContext('2d');
            this.manager = manager;
            this.map = map;
            this.canvas.width = this.map.width * this.map.cellSize;
            this.canvas.height = this.map.height * this.map.cellSize;
            var parent = this.canvas.parentNode;
            this.hasScroll = [
                (parent.clientWidth < this.canvas.width ? true : false),
                (parent.clientHeight < this.canvas.height ? true : false)
            ];
            this.offset = [0, 0];
            this.panSpeed = 5;
        }
        CanvasRenderer.prototype.render = function (renderList) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            renderList.forEach(function (id) {
                var item = this.manager.getById(id);
                var x = item.obj.x + this.offset[0];
                var y = item.obj.y + this.offset[1];
                var sprite = item.obj.sprite;
                var spriteOffset = item.obj.frame * this.map.cellSize;
                this.context.drawImage(sprite, spriteOffset, 0, this.map.cellSize, this.map.cellSize, x, y, this.map.cellSize, this.map.cellSize);
            }.bind(this));
        };
        CanvasRenderer.prototype.panLeft = function () {
            if (this.hasScroll[0] && this.offset[0] < 0) {
                this.offset[0] += this.panSpeed;
            }
        };
        CanvasRenderer.prototype.panRight = function () {
            if (this.hasScroll[0] && this.offset[0] + this.canvas.width > 0) {
                this.offset[0] -= this.panSpeed;
            }
        };
        CanvasRenderer.prototype.panUp = function () {
            if (this.hasScroll[1] && this.offset[1] < 0) {
                this.offset[1] += this.panSpeed;
            }
        };
        CanvasRenderer.prototype.panDown = function () {
            if (this.hasScroll[1] && this.offset[1] + this.canvas.height < 0) {
                this.offset[1] -= this.panSpeed;
            }
        };
        return CanvasRenderer;
    }());

    var BaseObject = (function () {
        function BaseObject(name, width, height, x, y, sprite, frames, frameTimes) {
            this.name = name;
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
            this.maxFrame = frames || null;
            this.frame = 0;
            var fallbackFrames = [];
            for (var i = 0; i < this.maxFrame; i += 1) {
                fallbackFrames.push(1000);
            }
            this.frameTimes = frameTimes || fallbackFrames;
            this.lastUpdateTime = new Date().getTime();
            this.lastFrame = 0;
            this.needsToRender = true;
            this.sprite = sprite;
        }
        BaseObject.prototype.update = function () {
            var now = new Date().getTime();
            if (now - this.lastUpdateTime >= this.frameTimes[this.frame]) {
                this.lastFrame = now - this.lastUpdateTime;
                this.lastUpdateTime = now;
                if (this.frame + 1 < this.maxFrame) {
                    this.frame += 1;
                }
            }
            this.needsToRender = true;
        };
        return BaseObject;
    }());

    var Blueprints = {
        plantGrass: {
            name: 'Grass',
            asset: 'Grass.png',
            frameTime: [10000, 60000],
            frames: 3,
            width: 1,
            height: 1
        },
        plantWheat: {
            name: 'Wheat',
            asset: 'Wheat.png',
            frameTime: 20000,
            frames: 2,
            width: 1,
            height: 1
        }
    };

    var ObjectManager = (function () {
        function ObjectManager(assetLoader, grid) {
            this.list = [];
            this.toRender = [];
            this.assetLoader = assetLoader;
            this.grid = grid;
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
            this.addObject(new BaseObject(name, width * this.grid.cellSize, height * this.grid.cellSize, x, y, this.assetLoader.assets['DefaultObject.png'], null, null));
        };
        ObjectManager.prototype.addObjectFromBlueprint = function (key, x, y) {
            if (Blueprints[key]) {
                var obj = Blueprints[key];
                this.addObject(new BaseObject(obj.name, obj.width * this.grid.cellSize, obj.height * this.grid.cellSize, x, y, this.assetLoader.assets[obj.asset], obj.frames, obj.frameTime));
            }
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

    function getCoordsFromPixels(x, y, grid, offset) {
        return [Math.floor((x + (offset[0] * -1)) / grid.cellSize), Math.floor((y + (offset[1] * -1)) / grid.cellSize)];
    }

    var keybindings = {
        action: 'Mouse1',
        altAction: 'Mouse2',
        moveDown: 's',
        moveLeft: 'a',
        moveRight: 'd',
        moveUp: 'w'
    };

    var Input = (function (_super) {
        __extends(Input, _super);
        function Input(renderer, grid, manager, sprite) {
            _super.call(this, 'Input', grid.cellSize, grid.cellSize, 0, 0, sprite, null);
            this.renderer = renderer;
            this.grid = grid;
            this.manager = manager;
            this.actionButtonActive = false;
            this.altActionButtonActive = false;
            this.move = {
                down: false,
                left: false,
                right: false,
                up: false
            };
            this.bindMouse();
            this.bindKeyboard();
        }
        Input.prototype.update = function () {
            this.needsToRender = true;
            if (this.move.up) {
                this.renderer.panUp();
            }
            else if (this.move.down) {
                this.renderer.panDown();
            }
            if (this.move.left) {
                this.renderer.panLeft();
            }
            else if (this.move.right) {
                this.renderer.panRight();
            }
        };
        Input.prototype.bindMouse = function () {
            this.renderer.canvas.addEventListener('mousemove', function (e) {
                var mousePosition = getCoordsFromPixels(e.offsetX, e.offsetY, this.grid, this.renderer.offset);
                console.log(mousePosition);
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
            document.addEventListener('contextmenu', function (e) {
                e.preventDefault();
            }, false);
        };
        Input.prototype.actionButtonClick = function () {
            console.log('click');
            this.manager.addObjectFromBlueprint('plantGrass', this.x, this.y);
        };
        Input.prototype.bindKeyboard = function () {
            window.addEventListener('keydown', function (e) {
                if (e.key === keybindings.moveUp) {
                    this.move.up = true;
                }
                else if (e.key === keybindings.moveDown) {
                    this.move.down = true;
                }
                if (e.key === keybindings.moveLeft) {
                    this.move.left = true;
                }
                else if (e.key === keybindings.moveRight) {
                    this.move.right = true;
                }
            }.bind(this));
            window.addEventListener('keyup', function (e) {
                if (e.key === keybindings.moveUp) {
                    this.move.up = false;
                }
                else if (e.key === keybindings.moveDown) {
                    this.move.down = false;
                }
                if (e.key === keybindings.moveLeft) {
                    this.move.left = false;
                }
                else if (e.key === keybindings.moveRight) {
                    this.move.right = false;
                }
            }.bind(this));
        };
        return Input;
    }(BaseObject));

    var Main = (function () {
        function Main() {
            var self = this;
            self.assetLoader = new AssetLoader();
            self.assetLoader.loadAssets([
                './static/resources/DefaultObject.png',
                './static/resources/mousePos.png',
                './static/resources/Grass.png'
            ]).then(function () {
                self.map = new Grid(10, 10, 64);
                self.manager = new ObjectManager(self.assetLoader, self.map);
                self.renderer = new CanvasRenderer(document.querySelector('canvas'), self.manager, self.map);
                self.input = new Input(self.renderer, self.map, self.manager, self.assetLoader.assets['mousePos.png']);
                self.manager.addObject(self.input);
                self.start();
            }, function (reason) {
                console.error(reason);
            });
        }
        Main.prototype.start = function () {
            this.step();
        };
        Main.prototype.update = function () {
            this.manager.update();
            this.renderer.render(this.manager.toRender);
            this.manager.toRender = [];
        };
        Main.prototype.step = function () {
            this.update();
            requestAnimationFrame(this.step.bind(this, null));
        };
        return Main;
    }());
    var app = new Main();
    console.log(app);

}());
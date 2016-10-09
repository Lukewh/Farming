class Grid {
    public width: number;
    public height: number;
    public cellSize: number;

    public grid: Array<any>;

    constructor(width: number, height: number, cellSize: number) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.grid = [];

        for (let row = 0; row < this.height; row += 1) {
            let columns = [];

            for (let col = 0; col < this.height; col += 1) {
                columns.push(null);
            }

            this.grid.push(columns);
        }
    }

    public toArray(): Array<any> {
        return this.grid;
    }
}

export default Grid;

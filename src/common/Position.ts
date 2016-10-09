import Grid from './Grid';

function getCoordsFromPixels(x: number, y: number, grid: Grid, offset: Array<number>): Array<number> {
    return [Math.floor((x  + (offset[0] * -1)) / grid.cellSize), Math.floor((y  + (offset[1] * -1)) / grid.cellSize)];
}

export {getCoordsFromPixels};
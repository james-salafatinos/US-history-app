class Cell {
  constructor(pos, tile) {
    this.pos = { x: pos.x, y: pos.y };

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.parent = null;
    this.neighbors = [];

    this.addNeighbors = (grid) => {
      if (this.pos.x < grid.length - 1)
        this.neighbors.push(grid[this.pos.x + 1][this.pos.y]);
      if (this.pos.x > 0) this.neighbors.push(grid[this.pos.x - 1][this.pos.y]);
      if (this.pos.y < grid[0].length - 1)
        this.neighbors.push(grid[this.pos.x][this.pos.y + 1]);
      if (this.pos.y > 0) this.neighbors.push(grid[this.pos.x][this.pos.y - 1]);
    };

    this.tile = tile;
  }
}

class Astar {
  constructor(grid, gridStart, gridEnd) {
    this.grid = grid;
    this.gridStart = gridStart;
    this.gridEnd = gridEnd;

    this.openSet = [this.gridStart];
    this.closedSet = [];

    this.path = [];
    this.isSearching = true;
    this.isSolvable;

    this.removeFromArray = (array, element) => {
      for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === element) array.splice(i, 1);
      }
    };

    this.heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

    this.search = () => {
      if (this.openSet.length > 0) {
        var pathIndex = 0;
        this.openSet.forEach((cell, key) => {
          if (cell.f < this.openSet[pathIndex].f) pathIndex = key;
        });
        var currentCell = this.openSet[pathIndex];

        if (currentCell === this.gridEnd) {
          this.isSearching = false;
          this.isSolvable = true;
        } else {
          this.removeFromArray(this.openSet, currentCell);
          this.closedSet.push(currentCell);

          currentCell.neighbors.forEach((neighbor) => {
            if (
              !this.closedSet.includes(neighbor) &&
              neighbor.tile !== "wall"
            ) {
              var g = currentCell.g + 1;

              if (this.openSet.includes(neighbor)) {
                if (g < neighbor.g) neighbor.g = g;
              } else {
                neighbor.g = g;
                this.openSet.push(neighbor);
              }

              neighbor.h = this.heuristic(neighbor.pos, this.gridEnd.pos);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = currentCell;
            }
          });
        }

        var path = [];
        var cell = currentCell;
        path.push(cell);

        var findPath = () => {
          path.push(cell.parent);
          cell = cell.parent;
          if (cell.parent) findPath();
        };
        if (cell.parent) findPath();
        this.path = path;
      } else {
        this.isSearching = false;
        this.isSolvable = false;
      }
    };
  }
}
module.exports = { Astar, Cell };

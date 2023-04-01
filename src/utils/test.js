const {
  Astar,
  Cell,
} = require("C:/Users/james/OneDrive/Desktop/repos/pixel-game/src/utils/astar.js");

var gridSize = { x: 32, y: 32 };

var grid = Array.from(Array(gridSize.x), () => new Array(gridSize.y));
for (let x = 0; x < gridSize.x; x++)
  for (let y = 0; y < gridSize.y; y++)
    grid[x][y] = new Cell(
      { x: x, y: y },
      Math.floor(Math.random() * 10) < 3 ? "wall" : "floor"
    );
grid.forEach((row) => row.forEach((cell) => cell.addNeighbors(grid)));

var gridStart = grid[0][0];
gridStart.tile = "floor";
var gridEnd = grid[gridSize.x - 1][gridSize.y - 1];
gridEnd.tile = "floor";

var pathFinder = new Astar(grid, gridStart, gridEnd);

for (let i = 0; i < 10000; i++) {
  if (pathFinder.isSearching) {
    pathFinder.search();
    if (pathFinder.path !== []) {
      console.log(pathFinder.path);
      break;
    }
  }
}

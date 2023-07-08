const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const parsedInput = INPUT.split("\n");

const grid = parsedInput.map((row) => {
  return row.split("").map((tree) => Number(tree));
});

const rows = grid.length;
const columns = grid[0].length;

const visibilityGrid = Array(rows)
  .fill()
  .map(() => Array(columns).fill(false));

// check east to west
for (let i = 0; i < grid.length; i++) {
  let maxRow = -1;
  for (let j = 0; j < grid[0].length; j++) {
    if (grid[i][j] > maxRow) {
      visibilityGrid[i][j] = true;
      maxRow = grid[i][j];
    }
  }
}

// check west to east
for (let i = 0; i < grid.length; i++) {
  let maxRow = -1;
  for (let j = grid[0].length - 1; j >= 0; j--) {
    if (grid[i][j] > maxRow) {
      visibilityGrid[i][j] = true;
      maxRow = grid[i][j];
    }
  }
}

// check north to south
for (let j = 0; j < grid[0].length; j++) {
  let maxRow = -1;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i][j] > maxRow) {
      visibilityGrid[i][j] = true;
      maxRow = grid[i][j];
    }
  }
}

// check south to north

for (let j = grid[0].length - 1; j >= 0; j--) {
  let maxRow = -1;
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i][j] > maxRow) {
      visibilityGrid[i][j] = true;
      maxRow = grid[i][j];
    }
  }
}

console.log(grid);
console.log(visibilityGrid);

let total = 0;

visibilityGrid.forEach((row) => row.forEach((cell) => (total += cell ? 1 : 0)));

console.log({ total });

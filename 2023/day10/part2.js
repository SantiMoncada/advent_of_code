//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @typedef  {{x:number,y:number}} Coords
 */
/**
 * @param {string} input
 * @returns {string[][]}
 */
function parseInput(input) {
  const lines = input.trim().split("\n");

  const ouput = [];
  for (const line of lines) {
    ouput.push(line.split(""));
  }

  return ouput;
}

const maze = parseInput(INPUT);

/**
 *
 * @param {string[][]} maze
 * @returns {Coords}
 */
function findAnimal(maze) {
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === "S") {
        return { x: j, y: i };
      }
    }
  }
  throw new Error("Animal not found");
}

const animalCoords = findAnimal(maze);

console.log(animalCoords);

/**
 * @type {Array<Coords|null>}
 */
const queue = [];
/**
 * @type {string[][]}
 */
const visited = Array(maze.length)
  .fill(" ")
  .map(() => Array(maze[0].length).fill(" "));

queue.push(animalCoords);
queue.push(null);
visited[animalCoords.y][animalCoords.x] = "S";

/**
 * @param {Coords} coords
 */
function checkNorth(coords) {
  const { x, y } = coords;

  if (visited[y - 1][x] === " ") {
    if (
      maze[y - 1][x] === "|" ||
      maze[y - 1][x] === "7" ||
      maze[y - 1][x] === "F"
    ) {
      visited[y - 1][x] = maze[y - 1][x];
      queue.push({ x, y: y - 1 });
    }
  }
}

/**
 * @param {Coords} coords
 */
function checkSouth(coords) {
  const { x, y } = coords;
  if (visited[y + 1][x] === " ") {
    if (
      maze[y + 1][x] === "|" ||
      maze[y + 1][x] === "L" ||
      maze[y + 1][x] === "J"
    ) {
      visited[y + 1][x] = maze[y + 1][x];
      queue.push({ x, y: y + 1 });
    }
  }
}

/**
 * @param {Coords} coords
 */
function checkEast(coords) {
  const { x, y } = coords;

  if (visited[y][x + 1] === " ") {
    if (
      maze[y][x + 1] === "-" ||
      maze[y][x + 1] === "J" ||
      maze[y][x + 1] === "7"
    ) {
      visited[y][x + 1] = maze[y][x + 1];
      queue.push({ x: x + 1, y });
    }
  }
}

/**
 * @param {Coords} coords
 */
function checkWest(coords) {
  const { x, y } = coords;
  if (visited[y][x - 1] === " ") {
    if (
      maze[y][x - 1] === "L" ||
      maze[y][x - 1] === "F" ||
      maze[y][x - 1] === "-"
    ) {
      visited[y][x - 1] = maze[y][x - 1];
      queue.push({ x: x - 1, y: y });
    }
  }
}

let counter = -1;
while (queue.length !== 0) {
  const currentCoords = queue.shift();
  if (currentCoords === null) {
    counter++;

    if (queue.length === 0) {
      break;
    }
    queue.push(null);
    continue;
  }

  if (!currentCoords) {
    throw new Error("no coords");
  }

  const { x, y } = currentCoords;

  const currentPipe = maze[y][x];

  printVisited(visited);

  switch (currentPipe) {
    case "|":
      checkNorth(currentCoords);
      checkSouth(currentCoords);
      break;
    case "-":
      checkEast(currentCoords);
      checkWest(currentCoords);
      break;
    case "L":
      checkNorth(currentCoords);
      checkEast(currentCoords);
      break;
    case "J":
      checkNorth(currentCoords);
      checkWest(currentCoords);
      break;
    case "7":
      checkSouth(currentCoords);
      checkWest(currentCoords);
      break;
    case "F":
      checkSouth(currentCoords);
      checkEast(currentCoords);
      break;
    case ".":
      break;
    case "S":
      checkNorth(currentCoords);
      checkSouth(currentCoords);
      checkWest(currentCoords);
      checkEast(currentCoords);
      break;
  }
}
printVisited(visited);
console.log(counter);

function printVisited(visited) {
  const charToDisplay = {
    "|": "│",
    "-": "─",
    L: "└",
    J: "┘",
    7: "┐",
    F: "┌",
    ".": ".",
    S: "╬",
    " ": " ",
  };
  let line = "";
  let separatorTop = "┌" + new Array(visited[0].length + 1).join("─") + "┐";
  let separatorBottom = "└" + new Array(visited[0].length + 1).join("─") + "┘";

  for (let i = 0; i < visited.length; i++) {
    line += "│";
    for (let j = 0; j < visited[i].length; j++) {
      line += charToDisplay[visited[i][j]];
    }
    line += "│";

    if (i < visited.length - 1) {
      line += "\n";
    }
  }
  // console.clear();

  console.log(separatorTop);
  console.log(line);
  console.log(separatorBottom);

  for (let k = 0; k < 100000000; k++) {}
}

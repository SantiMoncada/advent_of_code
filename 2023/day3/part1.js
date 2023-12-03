const { readFileSync } = require("fs");

const INPUT = readFileSync("./testinput1.txt", "utf8");

function parseInput(input) {
  const lines = input.split("\n");
  return lines.map((line) => line.split(""));
}

const matrix = parseInput(INPUT);

const iLen = matrix.length;
const jLen = matrix[0].length;

const map = Array(iLen)
  .fill()
  .map(() => Array(jLen).fill("."));

const symbolCoords = [];

for (let i = 0; i < iLen; i++) {
  for (let j = 0; j < jLen; j++) {
    if ("*$#".includes(matrix[i][j])) {
      if (isNumber(matrix[i - 1][j - 1])) {
        map[i - 1][j - 1] = matrix[i - 1][j - 1];
      }
      if (isNumber(matrix[i + 0][j - 1])) {
        map[i + 0][j - 1] = matrix[i + 0][j - 1];
      }
      if (isNumber(matrix[i + 1][j - 1])) {
        map[i + 1][j - 1] = matrix[i + 1][j - 1];
      }

      if (isNumber(matrix[i - 1][j + 0])) {
        map[i - 1][j + 0] = matrix[i - 1][j + 0];
      }
      if (isNumber(matrix[i + 1][j + 0])) {
        map[i + 1][j + 0] = matrix[i + 1][j + 0];
      }

      if (isNumber(matrix[i - 1][j + 1])) {
        map[i - 1][j + 1] = matrix[i - 1][j + 1];
      }
      if (isNumber(matrix[i - 0][j + 1])) {
        map[i - 0][j + 1] = matrix[i - 0][j + 1];
      }
      if (isNumber(matrix[i + 1][j + 1])) {
        map[i + 1][j + 1] = matrix[i + 1][j + 1];
      }
    }
  }
}

function isNumber(char) {
  if (char === undefined) {
    return false;
  }

  return char >= "0" && char <= "9";
}

let acc = 0;
for (const line of map) {
  for (const cell of line) {
    if (isNumber(cell)) {
      acc += parseInt(cell);
    }
  }
}
console.log(map);
console.log({ acc });

function searchNumber(i, j, matrix, destiny) {
  if (matrix[i][j] === undefined || destiny[i][j] === ".") {
    return;
  }

  if (isNumber(matrix[i][j])) {
    destiny[i][j] = matrix[i][j];

    if (matrix[i][j - 1] !== undefined && isNumber(matrix[i][j - 1])) {
      searchNumber(i, j - 1, matrix, destiny);
    }
    if (matrix[i][j + 1] !== undefined && isNumber(matrix[i][j + 1])) {
      searchNumber(i, j + 1, matrix, destiny);
    }
  }
}

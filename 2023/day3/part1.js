const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

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
    if (matrix[i][j] !== "." && !isNumber(matrix[i][j])) {
      if (isNumber(matrix[i - 1][j - 1])) {
        searchNumber(i - 1, j - 1, matrix, map);
      }
      if (isNumber(matrix[i + 0][j - 1])) {
        searchNumber(i + 0, j - 1, matrix, map);
      }
      if (isNumber(matrix[i + 1]?.[j - 1])) {
        searchNumber(i + 1, j - 1, matrix, map);
      }

      if (isNumber(matrix[i - 1]?.[j + 0])) {
        searchNumber(i - 1, j + 0, matrix, map);
      }
      if (isNumber(matrix[i + 1]?.[j + 0])) {
        searchNumber(i + 1, j + 0, matrix, map);
      }

      if (isNumber(matrix[i - 1]?.[j + 1])) {
        searchNumber(i - 1, j + 1, matrix, map);
      }
      if (isNumber(matrix[i - 0]?.[j + 1])) {
        searchNumber(i - 0, j + 1, matrix, map);
      }
      if (isNumber(matrix[i + 1]?.[j + 1])) {
        searchNumber(i + 1, j + 1, matrix, map);
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

function searchNumber(i, j, matrix, destiny) {
  if (matrix[i][j] === undefined || destiny[i][j] !== ".") {
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

let acc = 0;
let lineN = 1;
for (const line of map) {
  let currentNumber = "";
  for (const char of line) {
    if (char !== ".") {
      currentNumber += char;
    } else {
      const num = parseInt(currentNumber);
      if (!isNaN(num)) {
        console.log({ acc, num });
        acc += num;
      }
      currentNumber = "";
    }
  }
  console.log("-------------------------------------", lineN);
  lineN++;
}

console.log({ acc });

var fs = require("fs");

var file = fs.createWriteStream("array.txt");

map.forEach(function (v) {
  file.write(v.join("") + "\n");
});
file.end();

console.log(map[109].join(""));

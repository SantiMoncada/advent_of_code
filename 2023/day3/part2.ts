const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

function parseInput(input: any) {
  const lines = input.split("\n");
  return lines.map((line: any) => line.split(""));
}

const matrix: Array<Array<string>> = parseInput(INPUT);

const iLen = matrix.length;
const jLen = matrix[0].length;

const visited: Array<Array<boolean>> = Array(iLen)
  .fill([])
  .map(() => Array(jLen).fill(false));

function searchNumber(i: number, j: number): string {
  if (matrix[i] === undefined || matrix[i][j] === undefined) {
    return "";
  }

  if (!isNumber(matrix[i][j])) {
    return "";
  }

  if (visited[i][j]) {
    return "";
  }
  console.log("searching ", matrix[i][j]);
  visited[i][j] = true;
  const out = searchNumber(i, j - 1) + matrix[i][j] + searchNumber(i, j + 1);

  return out;
}

const squaredOffsets = [
  { i: -1, j: -1 },
  { i: 0, j: -1 },
  { i: 1, j: -1 },

  { i: -1, j: 0 },
  { i: 1, j: 0 },

  { i: -1, j: 1 },
  { i: 0, j: 1 },
  { i: 1, j: 1 },
];

let acc = 0;

for (let i = 0; i < iLen; i++) {
  for (let j = 0; j < jLen; j++) {
    let gearRatio = 1;
    let numbersAdjacentToGear = 0;
    if (matrix[i][j] === "*") {
      for (const offset of squaredOffsets) {
        if (isNumber(matrix[i + offset.i][j + offset.j])) {
          console.log({ i, j });
          const numberStr = searchNumber(i + offset.i, j + offset.j);

          if (numberStr !== "") {
            numbersAdjacentToGear++;
            console.log({ numberStr });
            gearRatio *= parseInt(numberStr);
          }
        }
      }
    }
    if (gearRatio > 1 && numbersAdjacentToGear > 1) {
      console.log({ gearRatio });
      acc += gearRatio;
    }
  }
}

function isNumber(char: string) {
  if (char === undefined) {
    return false;
  }

  return char >= "0" && char <= "9";
}

console.log({ acc });

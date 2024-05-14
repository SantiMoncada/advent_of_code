//@ts-check
const { readFileSync } = require("fs");

/**
 * @typedef {{row:string, list:number[]}} Spring
 */
/**
 * @param {string} input
 * @returns {Spring[]}
 */
function parseInput(input) {
  const lines = input.trim().split("\n");

  const ouput = [];
  for (const line of lines) {
    const [row, list] = line.split(" ");

    ouput.push({
      row,
      list: list
        .trim()
        .split(",")
        .map((e) => parseInt(e)),
    });
  }

  return ouput;
}

/**
 *
 * @param {string} row
 * @returns {string[]}
 */
function generateAllVariations(row) {
  const output = [];

  let ambigiousSpaces = 0;
  for (const char of row) {
    if (char === "?") {
      ambigiousSpaces++;
    }
  }

  for (let i = 0; i < 2 ** ambigiousSpaces; i++) {
    const binaryMap = i.toString(2).padStart(ambigiousSpaces, "0");

    let newRow = "";
    let j = 0;
    for (const char of row) {
      if (char === "?") {
        if (binaryMap[j] === "0") {
          newRow += ".";
        }
        if (binaryMap[j] === "1") {
          newRow += "#";
        }
        j++;
      } else {
        newRow += char;
      }
    }
    output.push(newRow);
  }

  return output;
}

/**
 *
 * @param {string} row
 */
function generateList(row) {
  const list = [];
  let counter = 0;
  for (const char of row) {
    if (char === "#") {
      counter++;
    }

    if (char === ".") {
      if (counter !== 0) {
        list.push(counter);
        counter = 0;
      }
    }
  }

  if (counter !== 0) {
    list.push(counter);
  }
  return list;
}

/**
 *
 * @param {Spring} spring
 * @returns {boolean}
 */
function validateSpring(spring) {
  const { row, list } = spring;
  if (row.includes("#")) {
    throw new Error("Cant handle ambigious spring");
  }

  return true;
}

/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 *
 * @returns {boolean}
 */
function compareArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

const INPUT = readFileSync("./input.txt", "utf8");
const data = parseInput(INPUT);

const ye = data.map((spring) => {
  return generateAllVariations(spring.row).filter((e) =>
    compareArrays(generateList(e), spring.list)
  ).length;
});

let result = 0;

for (const n of ye) {
  result += n;
}
console.log(result);

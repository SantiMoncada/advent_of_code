//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @param {string} input - The input string to be parsed.
 * @returns {string[][][]} The parsed matrix.
 */
function parseInput(input) {
  const lines = input.split("\n");
  const trimmedLines = lines.map((line) => line.split(":")[1].trim());
  const trimedTrimedLines = trimmedLines.map((line) =>
    line.split("|").map((col) => col.trim())
  );
  const idkAnymore = trimedTrimedLines.map((line) =>
    line.map((row) => row.split(" "))
  );

  return idkAnymore.map((line) =>
    line.map((row) => row.filter((number) => number != ""))
  );
}

const data = parseInput(INPUT);
let score = 0;
for (const card of data) {
  const [winning, myNumbers] = card;
  const winningSet = new Set(winning);

  let matches = 0;
  console.log(winningSet, myNumbers);
  for (const number of myNumbers) {
    if (winningSet.has(number)) {
      matches++;
    }
  }
  if (matches > 0) {
    score += Math.pow(2, matches - 1);
  }

  console.log({ matches });
}

console.log({ score });

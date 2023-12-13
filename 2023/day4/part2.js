//@ts-check
/**
 * @typedef {{winning:string[],current:string[]}} Card
 */

const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @param {string} input - The input string to be parsed.
 * @returns {Card[]} The parsed matrix.
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

  const idkAgain = idkAnymore.map((line) =>
    line.map((row) => row.filter((number) => number != ""))
  );

  return idkAgain.map((line) => {
    return { winning: line[0], current: line[1] };
  });
}

const data = parseInput(INPUT);

/**
 * @param {Card} card
 * @returns {number}
 */
function checkWins(card) {
  let wins = 0;
  const winningSet = new Set(card.winning);

  for (const number of card.current) {
    if (winningSet.has(number)) {
      wins++;
    }
  }

  return wins;
}

/**
 * @type {number[]}
 */
const scratChcards = new Array(data.length).fill(1);

for (let i = 0; i < data.length; i++) {
  const card = data[i];

  const wins = checkWins(card);

  for (let j = 0; j < wins; j++) {
    scratChcards[i + j + 1] += scratChcards[i];
  }

  console.log({ scratChcards });
}

console.log(scratChcards.reduce((a, b) => a + b));

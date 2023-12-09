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

const memo = {};
/**
 *
 * @param {Card[]} data
 * @param {number} index
 */
function checkWinMemo(data, index) {
  if (memo[index] !== undefined) {
    return memo[index];
  }

  const wins = checkWins(data[index]);

  memo[index] = wins;

  return wins;
}

/**
 * @type {number[]}
 */
const cardStack = [];

//add all the cards
for (let i = 0; i < data.length; i++) {
  cardStack.push(i);
}

let acc = 0;
while (cardStack.length !== 0) {
  acc++;

  const current = cardStack.pop();

  if (current !== undefined) {
    console.log(
      cardStack.map((elem) => ++elem),
      " ",
      current + 1
    );
  }

  if (current === undefined) {
    break;
  }

  const wins = checkWinMemo(data, current);

  for (let i = 1; i <= wins; i++) {
    cardStack.unshift(i + current);
  }

  console.log(cardStack.map((elem) => ++elem));
  console.log();
}

console.log({ acc });

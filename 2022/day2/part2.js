const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const parsedInput = INPUT.split("\n");

const rockVal = 1;
const paperVal = 2;
const scissorsVal = 3;

const losingVal = 0;
const tieVal = 3;
const winVal = 6;

const gameOutput = {
  "A X": losingVal + scissorsVal,
  "B X": losingVal + rockVal,
  "C X": losingVal + paperVal,

  "A Y": tieVal + rockVal,
  "B Y": tieVal + paperVal,
  "C Y": tieVal + scissorsVal,

  "A Z": winVal + paperVal,
  "B Z": winVal + scissorsVal,
  "C Z": winVal + rockVal,
};

let output = 0;

parsedInput.forEach((row) => {
  output += gameOutput[row];
});

console.log({ output });

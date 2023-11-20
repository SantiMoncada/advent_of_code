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
  "A X": rockVal + tieVal,
  "B X": rockVal + losingVal,
  "C X": rockVal + winVal,

  "A Y": paperVal + winVal,
  "B Y": paperVal + tieVal,
  "C Y": paperVal + losingVal,

  "A Z": scissorsVal + losingVal,
  "B Z": scissorsVal + winVal,
  "C Z": scissorsVal + tieVal,
};

let output = 0;

parsedInput.forEach((row) => {
  output += gameOutput[row];
  console.log(gameOutput[row]);
});

console.log({ output });

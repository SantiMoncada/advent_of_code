const { readFileSync } = require("fs");

const MOVES = readFileSync("./moves.txt", "utf8");
const CRATES = readFileSync("./crates.txt", "utf8");

const splitedMoves = MOVES.split("\n");
const splitedCrates = CRATES.split("\n");

const moves = splitedMoves.map((row) => {
  const move = row.split(" ");
  return [move[1], move[3] - 1, move[5] - 1];
});

const crates = splitedCrates.map((row) => {
  return row.split(",");
});

moves.forEach(async ([ammount, origin, destiny]) => {
  const aux = [];
  for (let i = 0; i < ammount; i++) {
    aux.unshift(crates[origin].pop());
  }

  crates[destiny].push(...aux);
});

const output = [];
console.log(crates);

crates.forEach((stack) => {
  output.push(stack.pop());
});

console.log(output.join(""));

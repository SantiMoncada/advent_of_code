const { BADFAMILY } = require("dns");
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const parsedInput = INPUT.split("\n");

const isOverlap = (a, b, x, y) => {
  if (Number(x) >= Number(a) && Number(y) <= Number(b)) {
    return true;
  }

  if (Number(a) >= Number(x) && Number(b) <= Number(y)) {
    return true;
  }

  if (
    Number(x) >= Number(a) &&
    Number(y) >= Number(b) &&
    Number(x) <= Number(b)
  ) {
    return true;
  }

  if (
    Number(a) >= Number(x) &&
    Number(b) >= Number(y) &&
    Number(a) <= Number(y)
  ) {
    return true;
  }

  return false;
};

let output = 0;

parsedInput.forEach((pair) => {
  const splited = pair.split(",");

  const [a, b] = splited[0].split("-");
  const [x, y] = splited[1].split("-");

  output += isOverlap(a, b, x, y) ? 1 : 0;
});

console.log({ output });

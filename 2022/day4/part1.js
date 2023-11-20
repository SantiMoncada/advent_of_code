const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const parsedInput = INPUT.split("\n");

const isOverlap = (a, b, x, y) => {
  if (Number(x) >= Number(a) && Number(y) <= Number(b)) {
    console.log("true");
    return true;
  }

  if (Number(a) >= Number(x) && Number(b) <= Number(y)) {
    console.log("true");

    return true;
  }
  console.log("false");

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

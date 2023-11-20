const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const checkRepeat = (str) => {
  return str.length !== new Set(str).size;
};

const packet = 13;

for (let i = packet; i < INPUT.length; i++) {
  console.log(INPUT.slice(i - packet, i + 1));
  console.log(checkRepeat(INPUT.slice(i - packet, i + 1)));
  if (!checkRepeat(INPUT.slice(i - packet, i + 1))) {
    console.log(i + 1);
    break;
  }
}

const { BADFAMILY } = require("dns");
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const parsedInput = INPUT.split("\n");

const getItemValue = (item) => {
  const code = item.charCodeAt(0);

  if (code >= 97 && code <= 122) {
    return code - 96;
  }
  if (code >= 65 && code <= 90) {
    return code - 38;
  }
  return null;
};

const findItemContainers = (bag) => {
  const compartment = new Set();

  for (let i = 0; i < bag.length / 2; i++) {
    compartment.add(bag[i]);
  }

  for (let i = bag.length / 2; i < bag.length; i++) {
    if (compartment.has(bag[i])) {
      return bag[i];
    }
  }

  return null;
};

let output = 0;

parsedInput.forEach((bag) => {
  const item = findItemContainers(bag);
  const itemValue = getItemValue(item);
  output += itemValue;
});

console.log({ output });

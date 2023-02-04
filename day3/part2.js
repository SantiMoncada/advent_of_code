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

const commonLetter = (str1, str2, str3) => {
  let set = new Set();
  let newSet = new Set();

  for (const letter of str1) {
    set.add(letter);
  }

  for (const letter of str2) {
    if (set.has(letter)) {
      newSet.add(letter);
    }
  }

  set = newSet;

  for (const letter of str3) {
    if (set.has(letter)) {
      return letter;
    }
  }

  return null;
};

let output = 0;

for (let i = 0; i < parsedInput.length; i += 3) {
  const badge = commonLetter(
    parsedInput[i],
    parsedInput[i + 1],
    parsedInput[i + 2]
  );
  console.log({ badge });
  output += getItemValue(badge);
}

console.log({ output });

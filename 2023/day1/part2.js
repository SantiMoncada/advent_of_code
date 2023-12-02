//@ts-check

const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const blocks = INPUT.split("\n");

const numberList = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const mapNumbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

/**
 * @param {string} word
 * @param {string} subWord
 * @param {number} offset
 *
 * @returns {boolean} matches
 */
function findSubstrsAtIdx(word, subWord, offset) {
  if (offset < 0) {
    throw new Error("Offset cant be negative");
  }

  if (word.length < subWord.length) {
    return false;
  }

  for (let i = 0; i < subWord.length; i++) {
    if (word[i + offset] === undefined || subWord[i] === undefined) {
      return false;
      throw new Error("Index out of bounds");
    }

    if (word[i + offset] !== subWord[i]) {
      return false;
    }
  }

  return true;
}
let acc = 0;
for (const block of blocks) {
  if (block === "") {
    continue;
  }

  let start = -1;
  let end = -1;

  blockLoop: for (let i = 0; i < block.length; i++) {
    if (block[i] >= "0" && block[i] <= "9") {
      start = parseInt(block[i]);
      break blockLoop;
    }

    for (const numberStr of numberList) {
      if (findSubstrsAtIdx(block, numberStr, i)) {
        start = mapNumbers[numberStr];
        break blockLoop;
      }
    }
  }

  blockLoop: for (let i = block.length - 1; i >= 0; i--) {
    if (block[i] >= "0" && block[i] <= "9") {
      end = parseInt(block[i]);
      break blockLoop;
    }

    for (const numberStr of numberList) {
      if (findSubstrsAtIdx(block, numberStr, i)) {
        end = mapNumbers[numberStr];
        break blockLoop;
      }
    }
  }
  if (end === null || start === null) {
    throw new Error("not found in block");
  }

  acc += start * 10 + end;

  console.log({ start, end, block });
  console.log({ acc });

  console.log("----------------------------------");
}

console.log({ acc });

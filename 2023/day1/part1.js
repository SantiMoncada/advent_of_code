const { readFileSync } = require("fs");

const INPUT = readFileSync("./testinput2.txt", "utf8");

const bloques = INPUT.split("\n");

const listOfNums = bloques.map(getNumbersFromString);

let acc = 0;
for (const number of listOfNums) {
  acc += number;
}

console.log({ acc });

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

/**
 *
 * @param {string} s
 * @returns {number}
 */
function getNumbersFromString(s) {
  s = s.replace("one", "1");
  s = s.replace("two", "2");
  s = s.replace("three", "3");
  s = s.replace("four", "4");
  s = s.replace("five", "5");
  s = s.replace("six", "6");
  s = s.replace("seven", "7");
  s = s.replace("eight", "8");
  s = s.replace("nine", "9");

  console.log({ s });
  let start = null;
  let end = null;

  for (let i = 0; i < s.length; i++) {
    if (s[i] >= "0" && s[i] <= "9") {
      start = parseInt(s[i]);
      break;
    }
  }

  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] >= "0" && s[i] <= "9") {
      end = parseInt(s[i]);
      break;
    }
  }

  return start * 10 + end;
}

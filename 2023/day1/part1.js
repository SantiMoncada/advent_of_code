//@ts-check

const { readFileSync } = require("fs");

const INPUT = readFileSync("./testinput.txt", "utf8");

const bloques = INPUT.split("\n");

/**
 *
 * @param {string} s
 * @returns {number|null}
 */
function getNumbersFromString(s) {
  let start = null
  let end = null
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

  if(end === null || start === null){
    return null
  }

  return start * 10 + end;
}


const listOfNums = bloques.map(getNumbersFromString);

let acc = 0;

for (const number of listOfNums) {
  console.log(number)
  if(number === null){
    console.error("not num found")
    process.exit(1);
  }

  acc += number;
}

console.log({acc})
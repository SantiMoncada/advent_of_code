//@ts-check
console.clear()
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const blocks = INPUT.split("\n")[0].split(",");

console.log(blocks)

/**
*@param {string} str
*/
function checkPair(str) {
  const len = str.length
  if (len % 2 === 1) {
    return false
  }
  for (let i = 0; i < len / 2; i++) {
    if (str[i] !== str[i + len / 2]) {
      return false
    }
  }
  return true
}

let sum = 0
for (const block of blocks) {

  const [start, end] = block.split("-")

  console.log({ start, end })

  for (let i = parseInt(start); i <= parseInt(end); i++) {
    if (checkPair(i.toString())) {
      sum += i
      console.log(i)
    }
  }
}


console.log("sum " + sum)

5666095551 //to low

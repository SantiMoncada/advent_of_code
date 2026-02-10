//@ts-check
console.clear()
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const blocks = INPUT.split("\n")[0].split(",");


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

/**
*@param {string} str
*/
function checkPatterns(str) {
  const len = str.length

  let foundPatterns = 0
  for (let i = 1; i <= len / 2; i++) {
    if (len % i !== 0) {
      continue
    }
    const slidingWindowSize = i
    const matchWindow = str.slice(0, slidingWindowSize)

    let matches = true
    for (let j = len / slidingWindowSize - 1; j >= 0; j--) {
      const extractedString = str.slice(j * slidingWindowSize, j * slidingWindowSize + slidingWindowSize)
      if (matchWindow !== extractedString) {
        matches = false
        break
      }
    }
    if (matches) {
      foundPatterns++
    }
  }
  return foundPatterns
}
let part1 = 0
let part2 = 0
console.clear()

console.log(blocks)
for (const block of blocks) {

  const [start, end] = block.split("-")

  console.log(block)
  for (let i = parseInt(start); i <= parseInt(end); i++) {
    if (checkPatterns(i.toString())) {
      part2 += i
    }
    if (checkPair(i.toString())) {
      part1 += i
    }
  }
}

console.log("part1 = " + part1)
console.log("part2 = " + part2)

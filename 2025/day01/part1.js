//@ts-check
console.clear()
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const blocks = INPUT.split("\n");


// console.log(blocks)

let currentValue = 50
let zeroTunrs = 0
let pointingAt0 = 0
let pointsPassing0 = 0

/**
 * @param {number} start
 * @param {number} end
 */
function calulate100s(start, end) {

  const mag = Math.abs(end - start)
  let rem = 0

  if (start < end) {
    rem = start % 100
    if (rem < 0) {
      rem = 100 + rem
    }
  } else {
    rem = start % 100
    if (rem < 0) {
      rem *= -1
    } else {
      rem = 100 - rem
    }
  }

  if (rem === 100) {
    rem = 0
  }
  const acc = Math.floor((rem + mag) / 100)
  return acc
}

for (const line of blocks) {
  const dirLetter = line[0]
  const value = parseInt(line.slice(1))
  if (dirLetter === undefined) {
    break
  }

  let dir = 0
  if (dirLetter === "L") {
    dir = -1
  } else if (dirLetter === "R") {
    dir = 1
  } else {
    throw Error("wrong dir")
  }


  const newValue = currentValue + value * dir
  pointsPassing0 += calulate100s(currentValue, newValue)
  currentValue = newValue

  if (currentValue % 100 === 0) {
    pointingAt0++
  }
}

console.log(`pointingAt0: ${pointingAt0}`)
console.log(`pointsPassing0:${Math.abs(pointsPassing0)}`)

const tests = [
  [0, 100, 1],
  [20, 90, 0],
  [-30, -90, 0],
  [35, 300, 3],
  [200, 370, 1],
  [130, 370, 2],
  [-535, -300, 3],
  [-400, -370, 0],
  [-490, -37, 4],
  [-1, 1, 1],
  [-250, 145, 4],
  [0, 500, 5],
  [0, -500, 5],
  [-100, 100, 2],
  [-101, 100, 3],
  [-101, 101, 3],
  [100, 0, 1],
  [90, 20, 0],
  [-90, -30, 0],
  [300, 35, 2],
  [370, 200, 2],
  [370, 130, 2],
  [-300, -535, 2],
  [-370, -400, 1],
  [-37, -490, 4],
  [1, -1, 1],
  [145, -250, 4],
  [500, 0, 5],
  [-500, 0, 5],
  [100, -100, 2],
  [100, -101, 2],
  [101, -101, 3]
]

for (const test of tests) {
  const [start, end, result] = test

  const calc = calulate100s(start, end)
  console.log(`${start}\t->\t${end}\t=\t${calc}\t${calc === result ? "match" : "not a match " + result}`)
}

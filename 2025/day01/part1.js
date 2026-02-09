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


  let acc = 0
  if (start < end) {

    let rem = start % 100
    if (rem < 0) {
      rem = 100 + rem
    }
    const mag = Math.abs(end - start)
    const turns = Math.floor((rem + mag) / 100)
    acc += turns
  } else {

    const rem = Math.abs(start % 100)
    const mag = Math.abs(end - start)
    const turns = Math.floor((rem + mag) / 100)
    acc += turns
  }
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

6351// too high
6152 //toolow?

6223//not it
6153//not
6154 //not

6289// advent code solver

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
  [-101, 101, 3]
]

for (const test of tests) {
  const [start, end, result] = test

  const calc = calulate100s(start, end)

  console.log(`${start} -> ${end} = ${calc}\t${calc === result ? "match" : "not a match " + result}`)
  const calcReverse = calulate100s(start, end)
  console.log(`${end} -> ${start} = ${calcReverse}\t${calcReverse === result ? "match" : "not a match " + result}`)
}

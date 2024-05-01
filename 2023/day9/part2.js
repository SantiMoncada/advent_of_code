//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @param {string} input
 * @returns {number[][]}
 */
function parseInput(input) {
  const lines = input.trim().split("\n");

  const ouput = [];
  for (const line of lines) {
    ouput.push(line.split(" ").map((e) => parseInt(e)));
  }

  return ouput;
}

const reports = parseInput(INPUT);

/**
 * @param {number[]} report
 * @returns {number}
 */
function predictNextValue(report) {
  //all 0's base case
  for (let i = 0; i < report.length; i++) {
    if (report[i] !== 0) {
      break;
    }

    if (i === report.length - 1) {
      return 0;
    }
  }

  /**
   * @type {number[]}
   */
  const diference = [];
  for (let i = 0; i < report.length - 1; i++) {
    diference[i] = report[i + 1] - report[i];
  }

  return -predictNextValue(diference) + report[0];
}

let count = 0;
for (const report of reports) {
  const prediction = predictNextValue(report);
  count += prediction;
}
console.log({ count });

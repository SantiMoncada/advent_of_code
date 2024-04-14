//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @typedef {{
 *  time : number,
 *  distance: number,
 * }} Race
 */

/**
 * @param {number} holdTime
 * @param {Race} race
 *
 * @returns {boolean}
 */
function win(holdTime, race) {
  if (holdTime >= race.time) {
    return false;
  }

  const timeLeft = race.time - holdTime;

  const speed = holdTime;

  const playerDistance = timeLeft * speed;

  return playerDistance > race.distance;
}

/**
 * @param {string} input
 * @returns {Race[]}
 */
function parseInput(input) {
  const lines = input.split("\n");

  const times = lines[0]
    .split(" ")
    .filter((char) => char !== "")
    .splice(1);

  const distances = lines[1]
    .split(" ")
    .filter((char) => char !== "")
    .splice(1);

  /**
   * @type {Race[]}
   */
  const data = [];
  for (let i = 0; i < times.length; i++) {
    data[i] = {
      time: parseInt(times[i]),
      distance: parseInt(distances[i]),
    };
  }

  return data;
}

const races = parseInput(INPUT);

let finalOutput = 1;

for (const race of races) {
  const { time, distance } = race;

  let waysOfWinning = 0;
  for (let i = 0; i < time; i++) {
    if (win(i, race)) {
      waysOfWinning++;
    }
  }

  finalOutput *= waysOfWinning;
}

console.log({ finalOutput });

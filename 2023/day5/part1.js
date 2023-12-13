//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @typedef {{
 *  destinationRangeStart : number,
 *  sourceRangeStart: number,
 *  rangeLength: number
 * }} Range
 *
 * @typedef {{
 *  seeds : number[],
 *  seedToSoil : Range[],
 *  soilToFertilizer : Range[],
 *  fertilizerToWater : Range[],
 *  lightToTemperature : Range[],
 *  waterToLight : Range[],
 *  temperatureToHumidity : Range[],
 *  humidityToLocation : Range[]
 * }} Almanac
 */

/**
 * @param {string} input
 * @returns {Almanac}
 */
function parseInput(input) {
  const lines = input.split("\n");
  /**
   * @type {Almanac}
   */
  const data = {
    seeds: [],
    seedToSoil: [],
    soilToFertilizer: [],
    fertilizerToWater: [],
    lightToTemperature: [],
    waterToLight: [],
    temperatureToHumidity: [],
    humidityToLocation: [],
  };

  let currentKey = "";

  outer: for (const line of lines) {
    const start = line.split(":")[0];
    switch (start) {
      case "seeds":
        data.seeds = line
          .split(": ")[1]
          .split(" ")
          .map((num) => parseInt(num));
        continue outer;
      case "seed-to-soil map":
        currentKey = "seedToSoil";
        continue outer;
      case "soil-to-fertilizer map":
        currentKey = "soilToFertilizer";
        continue outer;
      case "fertilizer-to-water map":
        currentKey = "fertilizerToWater";
        continue outer;
      case "water-to-light map":
        currentKey = "waterToLight";
        continue outer;
      case "light-to-temperature map":
        currentKey = "lightToTemperature";
        continue outer;
      case "temperature-to-humidity map":
        currentKey = "temperatureToHumidity";
        continue outer;
      case "humidity-to-location map":
        currentKey = "humidityToLocation";
        continue outer;
      case "":
        continue outer;
    }

    const [destinationRangeStart, sourceRangeStart, rangeLength] =
      line.split(" ");

    data[currentKey].push({
      destinationRangeStart: parseInt(destinationRangeStart),
      sourceRangeStart: parseInt(sourceRangeStart),
      rangeLength: parseInt(rangeLength),
    });
  }

  return data;
}

/**
 * @param {number} origin
 * @param {Range[]} ranges
 * @returns {number}
 */
function mapToRange(origin, ranges) {
  for (const range of ranges) {
    if (
      origin >= range.sourceRangeStart &&
      origin < range.sourceRangeStart + range.rangeLength //could be less than equals
    ) {
      const offset = origin - range.sourceRangeStart;
      return range.destinationRangeStart + offset;
    }
  }

  return origin;
}

const output = parseInput(INPUT);

/**
 * @type {Map<number,number>}
 */
const seedMap = new Map();

for (const seed of output.seeds) {
  seedMap.set(seed, seed);
}

for (const [key, value] of seedMap) {
  seedMap.set(key, mapToRange(value, output.seedToSoil));
}

for (const [key, value] of seedMap) {
  seedMap.set(key, mapToRange(value, output.soilToFertilizer));
}

for (const [key, value] of seedMap) {
  seedMap.set(key, mapToRange(value, output.fertilizerToWater));
}

for (const [key, value] of seedMap) {
  seedMap.set(key, mapToRange(value, output.waterToLight));
}

for (const [key, value] of seedMap) {
  seedMap.set(key, mapToRange(value, output.lightToTemperature));
}

for (const [key, value] of seedMap) {
  seedMap.set(key, mapToRange(value, output.temperatureToHumidity));
}

for (const [key, value] of seedMap) {
  seedMap.set(key, mapToRange(value, output.humidityToLocation));
}
console.log(seedMap);

let min = Infinity;

for (const [_, value] of seedMap) {
  if (value < min) {
    min = value;
  }
}

console.log({ min });

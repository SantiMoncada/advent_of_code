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
  const lines = input.split("\r\n");
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

/** @type {Map<number,number>}*/
const seedMap = new Map();

/**  @type {number[]}*/
const seeds = [];

for (const seed of output.seeds) {
  seeds.push(seed);
  seedMap.set(seed, seed);
}

for (let i = 0; i < seeds.length; i++) {
  seeds[i] = mapToRange(seeds[i], output.seedToSoil);
}

for (let i = 0; i < seeds.length; i++) {
  seeds[i] = mapToRange(seeds[i], output.soilToFertilizer);
}

for (let i = 0; i < seeds.length; i++) {
  seeds[i] = mapToRange(seeds[i], output.fertilizerToWater);
}

for (let i = 0; i < seeds.length; i++) {
  seeds[i] = mapToRange(seeds[i], output.waterToLight);
}

for (let i = 0; i < seeds.length; i++) {
  seeds[i] = mapToRange(seeds[i], output.lightToTemperature);
}

for (let i = 0; i < seeds.length; i++) {
  seeds[i] = mapToRange(seeds[i], output.temperatureToHumidity);
}

for (let i = 0; i < seeds.length; i++) {
  seeds[i] = mapToRange(seeds[i], output.humidityToLocation);
}

console.log(Math.min(...seeds));

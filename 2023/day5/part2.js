//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./testinput.txt", "utf8");

/**
 * @typedef {{
 *  start : number,
 *  length: number,
 * }} SeedRange
 *
 * @typedef {{
 *  destinationRangeStart : number,
 *  sourceRangeStart: number,
 *  rangeLength: number
 * }} Range
 *
 * @typedef {{
 *  seeds : SeedRange[],
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
 *
 * @returns {SeedRange[]}
 */
function parseSeeds(input) {
  const list = input
    .split(": ")[1]
    .split(" ")
    .map((num) => parseInt(num));

  /**
   * @type {SeedRange[]}
   */
  const output = [];

  for (let i = 0; i < list.length; i = i + 2) {
    const origin = list[i];
    const range = list[i + 1];

    output.push({ start: origin, length: range });
  }
  return output;
}

/**
 * @param {string} input
 *
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
        data.seeds = parseSeeds(line);

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
 * @param {SeedRange} seed
 * @param {Range} map
 *
 * @returns {SeedRange|null}
 */
function mapSeed(seed, map) {
  if (map.sourceRangeStart + map.rangeLength < seed.start) {
    //1
    return null;
  }

  if (seed.start + seed.length < map.sourceRangeStart) {
    //2
    return null;
  }

  if (
    map.sourceRangeStart < seed.start &&
    seed.start < map.sourceRangeStart + map.rangeLength &&
    map.sourceRangeStart + map.rangeLength < seed.start + seed.length
  ) {
    //3
    const originStart = seed.start;

    const originEnd = map.sourceRangeStart + map.rangeLength;

    const delta = map.destinationRangeStart - map.sourceRangeStart;

    return { start: originStart + delta, length: originEnd - originStart };
  }

  if (
    seed.start < map.sourceRangeStart &&
    map.sourceRangeStart + map.rangeLength < seed.start + seed.length
  ) {
    //4
    const originStart = map.sourceRangeStart;

    const delta = map.destinationRangeStart - map.sourceRangeStart;

    return { start: originStart + delta, length: map.rangeLength };
  }

  if (
    map.sourceRangeStart < seed.start + seed.length &&
    seed.start < map.sourceRangeStart &&
    seed.start + seed.length < map.sourceRangeStart + map.rangeLength
  ) {
    //5
    const originStart = map.sourceRangeStart;

    const originEnd = seed.start + seed.length;

    const delta = map.destinationRangeStart - map.sourceRangeStart;

    return { start: originStart + delta, length: originEnd - originStart };
  }

  if (
    map.sourceRangeStart < seed.start &&
    seed.start + seed.length < map.sourceRangeStart + map.rangeLength
  ) {
    //6
    const originStart = seed.start;

    const originEnd = seed.start + seed.length;

    const delta = map.destinationRangeStart - map.sourceRangeStart;

    return { start: originStart + delta, length: originEnd - originStart };
  }
  throw new Error(
    `unhandle map error ${JSON.stringify(seed)} ${JSON.stringify(map)}`
  );
}

const output = parseInput(INPUT);
console.log(output);

function idkTheWin() {
  console.log("---------------------------");

  let seedRanges = output.seeds;
  console.log({ seedRanges });
  /**
   * @type {Array<SeedRange>}
   */
  let auxSeedRange = [];

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    for (const map of output.seedToSoil) {
      const newRange = mapSeed(seedRange, map);
      if (newRange !== null) {
        auxSeedRange.push(newRange);
      }
    }
    seedRanges = auxSeedRange;
  }

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    for (const map of output.soilToFertilizer) {
      const newRange = mapSeed(seedRange, map);
      if (newRange !== null) {
        auxSeedRange.push(newRange);
      }
    }
    seedRanges = auxSeedRange;
  }

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    for (const map of output.fertilizerToWater) {
      const newRange = mapSeed(seedRange, map);
      if (newRange !== null) {
        auxSeedRange.push(newRange);
      }
    }
    seedRanges = auxSeedRange;
  }

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    for (const map of output.waterToLight) {
      const newRange = mapSeed(seedRange, map);
      if (newRange !== null) {
        auxSeedRange.push(newRange);
      }
    }
    seedRanges = auxSeedRange;
  }

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    for (const map of output.lightToTemperature) {
      const newRange = mapSeed(seedRange, map);
      if (newRange !== null) {
        auxSeedRange.push(newRange);
      }
    }
    seedRanges = auxSeedRange;
  }

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    for (const map of output.temperatureToHumidity) {
      const newRange = mapSeed(seedRange, map);
      if (newRange !== null) {
        auxSeedRange.push(newRange);
      }
    }
    seedRanges = auxSeedRange;
  }

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    for (const map of output.humidityToLocation) {
      const newRange = mapSeed(seedRange, map);
      if (newRange !== null) {
        auxSeedRange.push(newRange);
      }
    }
    seedRanges = auxSeedRange;
  }

  console.log(seedRanges);
}

const testSeed = { start: 4_242_091_162, length: 52_876_134 };

const testMap = {
  destinationRangeStart: 3_688_283_374,
  sourceRangeStart: 3_968_162_731,
  rangeLength: 326_804_565,
};

console.log(mapSeed(testSeed, testMap));

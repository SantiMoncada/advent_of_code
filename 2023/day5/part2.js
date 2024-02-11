//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

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
 * @param {Range[]} maps
 *
 * @returns {SeedRange[]}
 */
function mapSeed(seed, maps) {
  /**
   * @type {SeedRange[]}
   */
  const oldSeeds = [];
  /**
   * @type {SeedRange[]}
   */
  const newSeeds = [];
  for (const map of maps) {
    if (map.sourceRangeStart + map.rangeLength - 1 < seed.start) {
      //1
      console.log("1");
      continue;
    }

    if (seed.start + seed.length - 1 < map.sourceRangeStart) {
      //2
      console.log("2");
      continue;
    }
    if (
      map.sourceRangeStart <= seed.start &&
      seed.start + seed.length <= map.sourceRangeStart + map.rangeLength
    ) {
      //6
      console.log("6");
      const delta = map.destinationRangeStart - map.sourceRangeStart;

      newSeeds.push({
        start: seed.start + delta,
        length: seed.length,
      });
      continue;
    }

    if (
      map.sourceRangeStart <= seed.start &&
      seed.start <= map.sourceRangeStart + map.rangeLength &&
      map.sourceRangeStart + map.rangeLength <= seed.start + seed.length
    ) {
      //3
      console.log("3");
      const delta = map.destinationRangeStart - map.sourceRangeStart;

      newSeeds.push({
        start: seed.start + delta,
        length: map.sourceRangeStart + map.rangeLength - seed.start,
      });

      oldSeeds.push({
        start: map.sourceRangeStart + map.rangeLength,
        length:
          seed.start + seed.length - map.sourceRangeStart - map.rangeLength,
      });
      continue;
    }

    if (
      map.sourceRangeStart <= seed.start + seed.length &&
      seed.start <= map.sourceRangeStart &&
      seed.start + seed.length <= map.sourceRangeStart + map.rangeLength
    ) {
      //5
      console.log("5");
      const delta = map.destinationRangeStart - map.sourceRangeStart;

      newSeeds.push({
        start: map.destinationRangeStart,
        length: seed.start + seed.length - map.sourceRangeStart,
      });

      oldSeeds.push({
        start: seed.start,
        length: map.sourceRangeStart - seed.start,
      });
      continue;
    }

    if (
      seed.start < map.sourceRangeStart &&
      map.sourceRangeStart + map.rangeLength <= seed.start + seed.length
    ) {
      //4
      console.log("4");
      const delta = map.destinationRangeStart - map.sourceRangeStart;

      newSeeds.push({
        start: map.sourceRangeStart + delta,
        length: map.rangeLength,
      });

      oldSeeds.push({
        start: seed.start,
        length: map.sourceRangeStart - seed.start,
      });

      oldSeeds.push({
        start: map.sourceRangeStart + map.rangeLength,
        length:
          seed.start + seed.length - map.sourceRangeStart - map.rangeLength,
      });

      continue;
    }

    throw new Error(
      `unhandle map error ${JSON.stringify(seed)} ${JSON.stringify(map)}`
    );
  }

  const output = [...newSeeds, ...oldSeeds];
  output.forEach((output) => {
    if (output.length === 0) {
      throw new Error(`wtf 0 ${JSON.stringify(seed)} ${JSON.stringify(maps)}`);
    }
  });
  if (output.length === 0) {
    return [seed];
  }

  return output;
}

const output = parseInput(INPUT);

function computeAnswer() {
  let seedRanges = output.seeds;
  console.log(seedRanges);
  /**
   * @type {SeedRange[]}
   */
  let auxSeedRange = [];

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.seedToSoil);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.soilToFertilizer);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.fertilizerToWater);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.waterToLight);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.lightToTemperature);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.temperatureToHumidity);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.humidityToLocation);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  console.log(seedRanges);

  return seedRanges;
}

function test() {
  const assert = require("assert");

  /**
   * @param {string} msg
   * @param {SeedRange[]} expected
   * @param {SeedRange[]} actual
   */
  function testMapSeed(msg, expected, actual) {
    try {
      assert(
        JSON.stringify(expected) === JSON.stringify(actual),
        `${msg}\n the expected values are \n ${JSON.stringify(
          expected
        )} \n and te actual values were \n ${JSON.stringify(actual)}
        \n
        `
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  testMapSeed(
    "Tests the case on the left 1",
    [{ start: 10, length: 10 }],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 2, rangeLength: 2, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case on the right 2",
    [{ start: 10, length: 10 }],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 22, rangeLength: 2, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case 3 on the left edge",
    [
      { start: 106, length: 4 },
      { start: 14, length: 6 },
    ],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 4, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case 4",
    [
      { start: 100, length: 5 },
      { start: 10, length: 2 },
      { start: 17, length: 3 },
    ],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 12, rangeLength: 5, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case 5",
    [
      { start: 100, length: 3 },
      { start: 10, length: 7 },
    ],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 17, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case 6",
    [{ start: 106, length: 10 }],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 4, rangeLength: 20, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "point seed on the left of the map",
    [{ start: 100, length: 1 }],
    mapSeed({ start: 10, length: 1 }, [
      { sourceRangeStart: 10, rangeLength: 20, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "point seed on the outside left of the map",
    [{ start: 9, length: 1 }],
    mapSeed({ start: 9, length: 1 }, [
      { sourceRangeStart: 10, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "point seed on the right of the map",
    [{ start: 109, length: 1 }],
    mapSeed({ start: 19, length: 1 }, [
      { sourceRangeStart: 10, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "point seed on the outside right of the map",
    [{ start: 100, length: 1 }],
    mapSeed({ start: 10, length: 1 }, [
      { sourceRangeStart: 10, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "match the seed and the range",
    [{ start: 100, length: 10 }],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 10, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "match just uder the seed and the range",
    [
      { start: 100, length: 8 },
      { start: 10, length: 1 },
      { start: 19, length: 1 },
    ],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 11, rangeLength: 8, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Rigth seed starting on the right range",
    [
      { start: 109, length: 1 },
      { start: 20, length: 9 },
    ],
    mapSeed({ start: 19, length: 10 }, [
      { sourceRangeStart: 10, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Left seed starting on the left range",
    [
      { start: 100, length: 1 },
      { start: 3, length: 7 },
    ],
    mapSeed({ start: 3, length: 8 }, [
      { sourceRangeStart: 10, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Seed and map starting at the left of seed",
    [
      { start: 100, length: 5 },
      { start: 15, length: 5 },
    ],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 10, rangeLength: 5, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Seed and map starting at the right of seed",
    [
      { start: 100, length: 5 },
      { start: 10, length: 5 },
    ],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 15, rangeLength: 5, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Bug going on 3 in the testinput2",
    [{ start: 49, length: 1 }],
    mapSeed({ start: 53, length: 1 }, [
      { destinationRangeStart: 49, sourceRangeStart: 53, rangeLength: 8 },
      { destinationRangeStart: 0, sourceRangeStart: 11, rangeLength: 42 },
      { destinationRangeStart: 42, sourceRangeStart: 0, rangeLength: 7 },
      { destinationRangeStart: 57, sourceRangeStart: 7, rangeLength: 4 },
    ])
  );
}

test();

let locations = computeAnswer();

locations = locations.sort((a, b) => a.start - b.start);

console.log(locations);

console.log(locations[0].start);

//@ts-check
const { readFileSync } = require("fs");

// const INPUT = readFileSync("./2023/day5/testinput2.txt", "utf8");
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
  //asume no overlap in maps
  const sortedMaps = maps.sort((a, b) => {
    return a.sourceRangeStart - b.sourceRangeStart;
  });
  /**
   * @type {SeedRange[]}
   */
  const mappedSeeds = [];

  let lastNotChecked = 0;
  for (let i = 0; i < sortedMaps.length; i++) {
    const currentMap = sortedMaps[i];
    //check for seed between lastChecked and the start of current map

    //1
    if (
      seed.start < lastNotChecked &&
      seed.start + seed.length > lastNotChecked &&
      seed.start + seed.length < currentMap.sourceRangeStart
    ) {
      // console.log("1");
      mappedSeeds.push({
        start: lastNotChecked,
        length: seed.start + seed.length - lastNotChecked,
      });
    }

    //2
    if (
      lastNotChecked <= seed.start &&
      seed.start <= currentMap.sourceRangeStart - 1 &&
      seed.start + seed.length - 1 >= lastNotChecked &&
      seed.start + seed.length - 1 <= currentMap.sourceRangeStart - 1
    ) {
      // console.log("2");
      mappedSeeds.push({
        start: seed.start,
        length: seed.length,
      });
    }

    //3
    if (
      seed.start > lastNotChecked &&
      seed.start <= currentMap.sourceRangeStart - 1 &&
      seed.start + seed.length > currentMap.sourceRangeStart
    ) {
      // console.log("3");
      mappedSeeds.push({
        start: seed.start,
        length: currentMap.sourceRangeStart - seed.start,
      });
    }

    //4
    if (
      seed.start < lastNotChecked &&
      currentMap.sourceRangeStart - 1 < seed.start + seed.length
    ) {
      // console.log("4");
      mappedSeeds.push({
        start: lastNotChecked,
        length: currentMap.sourceRangeStart - 1 - lastNotChecked,
      });
    }

    //now we check inside the map

    //1m
    if (
      seed.start < currentMap.sourceRangeStart &&
      seed.start + seed.length > currentMap.sourceRangeStart &&
      seed.start + seed.length <=
        currentMap.sourceRangeStart + currentMap.rangeLength
    ) {
      // console.log("1m");
      mappedSeeds.push({
        start: currentMap.destinationRangeStart,
        length: seed.start + seed.length - currentMap.sourceRangeStart,
      });
    }

    //2m
    if (
      currentMap.sourceRangeStart <= seed.start &&
      seed.start <= currentMap.sourceRangeStart + currentMap.rangeLength - 1 &&
      seed.start + seed.length - 1 >= currentMap.sourceRangeStart &&
      seed.start + seed.length - 1 <=
        currentMap.sourceRangeStart + currentMap.rangeLength
    ) {
      // console.log("2m");
      mappedSeeds.push({
        start:
          currentMap.destinationRangeStart +
          seed.start -
          currentMap.sourceRangeStart,
        length: seed.length,
      });
    }

    //3m
    if (
      seed.start >= currentMap.sourceRangeStart &&
      seed.start < currentMap.sourceRangeStart + currentMap.rangeLength &&
      seed.start + seed.length >
        currentMap.sourceRangeStart + currentMap.rangeLength
    ) {
      // console.log("3m");
      mappedSeeds.push({
        start:
          currentMap.destinationRangeStart +
          seed.start -
          currentMap.sourceRangeStart,
        length:
          currentMap.sourceRangeStart + currentMap.rangeLength - seed.start,
      });
    }

    //4m
    if (
      seed.start < currentMap.sourceRangeStart &&
      currentMap.sourceRangeStart + currentMap.rangeLength <
        seed.start + seed.length
    ) {
      // console.log("4m");
      mappedSeeds.push({
        start: currentMap.destinationRangeStart,
        length: currentMap.rangeLength,
      });
    }

    lastNotChecked = currentMap.sourceRangeStart + currentMap.rangeLength;
  }

  //check any remaining seeds on the right to infinity
  if (
    seed.start < lastNotChecked &&
    lastNotChecked <= seed.start + seed.length - 1
  ) {
    // console.log("1e");
    mappedSeeds.push({
      start: lastNotChecked,
      length: seed.start + seed.length - lastNotChecked,
    });
  }

  if (
    lastNotChecked <= seed.start &&
    lastNotChecked <= seed.start + seed.length - 1
  ) {
    // console.log("2e");
    mappedSeeds.push({
      start: seed.start,
      length: seed.length,
    });
  }

  return mappedSeeds.filter((seed) => seed.length >= 0);
}

function computeAnswer() {
  const output = parseInput(INPUT);
  let seedRanges = output.seeds;
  // console.log(seedRanges);
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
  // console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.soilToFertilizer);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  // console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.fertilizerToWater);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  // console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.waterToLight);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  // console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.lightToTemperature);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  // console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.temperatureToHumidity);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  // console.log(seedRanges);

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.humidityToLocation);
    auxSeedRange.push(...newSeedRanges);
  }
  seedRanges = auxSeedRange;
  // console.log(seedRanges);

  return seedRanges;
}

function test() {
  const assert = require("assert");

  /**
   * @param {string} msg
   * @param {SeedRange[]} expected
   * @param {SeedRange[]} actual
   */
  function testMapSeed(msg, actual, expected) {
    try {
      assert(
        JSON.stringify(expected) === JSON.stringify(actual),
        `${msg}\n the actual values are \n ${JSON.stringify(
          expected
        )} \n and te expected values were \n ${JSON.stringify(actual)}
        \n
        `
      );
      console.log("FUCKING SUCCESS");
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
      { start: 10, length: 2 },
      { start: 100, length: 5 },
      { start: 17, length: 3 },
    ],
    mapSeed({ start: 10, length: 10 }, [
      { sourceRangeStart: 12, rangeLength: 5, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case 5",
    [
      { start: 10, length: 7 },
      { start: 100, length: 3 },
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
      { start: 10, length: 1 },
      { start: 100, length: 8 },
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
      { start: 3, length: 7 },
      { start: 100, length: 1 },
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
      { start: 10, length: 5 },
      { start: 100, length: 5 },
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

  testMapSeed(
    "Bug going on soil to fertilizer in the testinput2",
    [],
    mapSeed({ start: 14, length: 1 }, [
      { destinationRangeStart: 39, sourceRangeStart: 0, rangeLength: 15 },
      { destinationRangeStart: 0, sourceRangeStart: 15, rangeLength: 37 },
      { destinationRangeStart: 37, sourceRangeStart: 52, rangeLength: 2 },
    ])
  );
}

// test();

let locations = computeAnswer();

locations = locations.sort((a, b) => a.start - b.start);

console.log(locations);

console.log(locations[0].start);

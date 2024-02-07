//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./testinput2.txt", "utf8");

/**
 * @typedef {{
 *  start : number,
 *  length: number,
 *  original: number,
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

    output.push({ start: origin, length: range, original: origin });
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
    if (map.sourceRangeStart + map.rangeLength < seed.start) {
      //1
      continue;
    }

    if (seed.start + seed.length < map.sourceRangeStart) {
      //2

      continue;
    }

    if (
      map.sourceRangeStart <= seed.start &&
      seed.start <= map.sourceRangeStart + map.rangeLength &&
      map.sourceRangeStart + map.rangeLength <= seed.start + seed.length
    ) {
      //3

      const originStart = seed.start;

      const originEnd = map.sourceRangeStart + map.rangeLength;

      const delta = map.destinationRangeStart - map.sourceRangeStart;
      console.log(delta);
      newSeeds.push({
        start: originStart + delta,
        length: originEnd - originStart + 1,
        original: seed.original,
      });

      oldSeeds.push({
        start: map.sourceRangeStart + map.rangeLength + 1,
        length: seed.start - map.sourceRangeStart,
        original:
          seed.original +
          map.sourceRangeStart +
          map.rangeLength -
          seed.start +
          1,
      });
      continue;
    }

    if (
      seed.start < map.sourceRangeStart &&
      map.sourceRangeStart + map.rangeLength <= seed.start + seed.length
    ) {
      //4

      const originStart = map.sourceRangeStart;

      const delta = map.destinationRangeStart - map.sourceRangeStart;

      newSeeds.push({
        start: originStart + delta,
        length: map.rangeLength + 1,
        original: seed.original + map.sourceRangeStart - seed.start,
      });

      oldSeeds.push({ original: seed.original });
      continue;
    }

    if (
      map.sourceRangeStart <= seed.start + seed.length &&
      seed.start <= map.sourceRangeStart &&
      seed.start + seed.length < map.sourceRangeStart + map.rangeLength
    ) {
      //5

      const originStart = map.sourceRangeStart;

      const originEnd = seed.start + seed.length;

      const delta = map.destinationRangeStart - map.sourceRangeStart;

      newSeeds.push({
        start: originStart + delta,
        length: originEnd - originStart,
        original: seed.original + map.sourceRangeStart - seed.start,
      });

      oldSeeds.push({
        original:
          seed.original +
          map.sourceRangeStart +
          map.destinationRangeStart -
          seed.start,
        start: map.sourceRangeStart + map.destinationRangeStart,
        length:
          map.sourceRangeStart + map.rangeLength - seed.start - seed.length,
      });
    }

    if (
      map.sourceRangeStart <= seed.start &&
      seed.start + seed.length <= map.sourceRangeStart + map.rangeLength
    ) {
      //6

      const originStart = seed.start;

      const originEnd = seed.start + seed.length;

      const delta = map.destinationRangeStart - map.sourceRangeStart;

      newSeeds.push({
        start: originStart + delta,
        length: originEnd - originStart,
        original: seed.original,
      });
      continue;
    }

    throw new Error(
      `unhandle map error ${JSON.stringify(seed)} ${JSON.stringify(map)}`
    );
  }

  return [...newSeeds, ...oldSeeds];
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

  // auxSeedRange = [];
  // for (const seedRange of seedRanges) {
  //   for (const map of output.soilToFertilizer) {
  //     const newRange = mapSeed(seedRange, map);
  //     if (newRange !== null) {
  //       auxSeedRange.push(...newRange);
  //     }
  //   }
  //   seedRanges = auxSeedRange;
  // }

  // console.log(auxSeedRange);

  // auxSeedRange = [];
  // for (const seedRange of seedRanges) {
  //   for (const map of output.fertilizerToWater) {
  //     const newRange = mapSeed(seedRange, map);
  //     if (newRange !== null) {
  //       auxSeedRange.push(...newRange);
  //     }
  //   }
  //   seedRanges = auxSeedRange;
  // }

  // auxSeedRange = [];
  // for (const seedRange of seedRanges) {
  //   for (const map of output.waterToLight) {
  //     const newRange = mapSeed(seedRange, map);
  //     if (newRange !== null) {
  //       auxSeedRange.push(...newRange);
  //     }
  //   }
  //   seedRanges = auxSeedRange;
  // }

  // auxSeedRange = [];
  // for (const seedRange of seedRanges) {
  //   for (const map of output.lightToTemperature) {
  //     const newRange = mapSeed(seedRange, map);
  //     if (newRange !== null) {
  //       auxSeedRange.push(...newRange);
  //     }
  //   }
  //   seedRanges = auxSeedRange;
  // }

  // auxSeedRange = [];
  // for (const seedRange of seedRanges) {
  //   for (const map of output.temperatureToHumidity) {
  //     const newRange = mapSeed(seedRange, map);
  //     if (newRange !== null) {
  //       auxSeedRange.push(...newRange);
  //     }
  //   }
  //   seedRanges = auxSeedRange;
  // }

  // auxSeedRange = [];
  // for (const seedRange of seedRanges) {
  //   for (const map of output.humidityToLocation) {
  //     const newRange = mapSeed(seedRange, map);
  //     if (newRange !== null) {
  //       auxSeedRange.push(...newRange);
  //     }
  //   }
  //   seedRanges = auxSeedRange;
  // }

  return seedRanges;
}

// const seedRanges = idkTheWin();

// const starts = seedRanges.sort((a, b) => a.start - b.start);

function test() {
  const assert = require("assert");

  /**
   * @param {string} msg
   * @param {SeedRange[]} a
   * @param {SeedRange[]} b
   */
  function testMapSeed(msg, a, b) {
    assert(
      JSON.stringify(a) === JSON.stringify(b),
      `${msg}\n the values are \n ${JSON.stringify(
        a
      )} \n and \n ${JSON.stringify(b)}
      \n
      `
    );
  }

  testMapSeed(
    "Tests the case on the left 1",
    [],
    mapSeed({ start: 10, length: 10, original: 10 }, [
      { sourceRangeStart: 2, rangeLength: 2, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case on the right 2",
    [],
    mapSeed({ start: 10, length: 10, original: 10 }, [
      { sourceRangeStart: 22, rangeLength: 2, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case 3 on the left edge",
    [
      { start: 106, length: 5, original: 10 },
      { start: 15, length: 6, original: 15 },
    ],
    mapSeed({ start: 10, length: 10, original: 10 }, [
      { sourceRangeStart: 4, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  testMapSeed(
    "Tests the case 4",
    [
      { start: 100, length: 6, original: 12 },
      { start: 10, length: 2, original: 10 },
      { start: 18, length: 2, original: 20 },
    ],
    mapSeed({ start: 10, length: 10, original: 10 }, [
      { sourceRangeStart: 12, rangeLength: 5, destinationRangeStart: 100 },
    ])
  );

  //test work in progress
  testMapSeed(
    "Tests the case 5",
    [],
    mapSeed({ start: 10, length: 10, original: 10 }, [
      { sourceRangeStart: 17, rangeLength: 10, destinationRangeStart: 100 },
    ])
  );

  //test work in progress
  testMapSeed(
    "Tests the case 6",
    [],
    mapSeed({ start: 10, length: 10, original: 10 }, [
      { sourceRangeStart: 4, rangeLength: 20, destinationRangeStart: 100 },
    ])
  );
}

test();
// console.log(starts);

//115756317 to  3541110360 is too high

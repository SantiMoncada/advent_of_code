const { readFileSync } = require("fs");
//@ts-check

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
 *
 * @param {SeedRange} range
 * @param {*} rangeToDelete
 */
function deleteRange(range, rangeToDelete) {}

/**
 * @param {SeedRange} seed
 * @param {Range[]} maps
 *
 * @returns {SeedRange[]}
 */
function mapSeed(seed, maps) {
  const newSeeds = [];
  for (const map of maps) {
    if (map.sourceRangeStart + map.rangeLength < seed.start) {
      //1
      return [];
    }

    if (seed.start + seed.length < map.sourceRangeStart) {
      //2
      return [];
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

      newSeeds.push({
        start: originStart + delta,
        length: originEnd - originStart,
        original: seed.original,
      });

      seed.original =
        seed.original + (map.sourceRangeStart + map.rangeLength) - seed.start;
      seed.start = map.sourceRangeStart + map.rangeLength;
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
        length: map.rangeLength,
        original: seed.original + map.sourceRangeStart - seed.start,
      });
      
      return [
        {
          start: originStart + delta,
          length: map.rangeLength,
          original: seed.original + map.sourceRangeStart - seed.start,
        },
      ];
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

      return [
        {
          start: originStart + delta,
          length: originEnd - originStart,
          original: seed.original + map.sourceRangeStart - seed.start,
        },
      ];
    }

    if (
      map.sourceRangeStart <= seed.start &&
      seed.start + seed.length <= map.sourceRangeStart + map.rangeLength
    ) {
      //6
      const originStart = seed.start;

      const originEnd = seed.start + seed.length;

      const delta = map.destinationRangeStart - map.sourceRangeStart;

      return [
        {
          start: originStart + delta,
          length: originEnd - originStart,
          original: seed.original,
        },
      ];
    }
    throw new Error(
      `unhandle map error ${JSON.stringify(seed)} ${JSON.stringify(map)}`
    );
  }

  return [];
}

const output = parseInput(INPUT);

function idkTheWin() {
  let seedRanges = output.seeds;
  console.log(seedRanges);
  /**
   * @type {SeedRange[]}
   */
  let auxSeedRange = [];

  auxSeedRange = [];
  for (const seedRange of seedRanges) {
    const newSeedRanges = mapSeed(seedRange, output.seedToSoil);
    auxSeedRange.push(...newSeedRanges)
  }

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

const seedRanges = idkTheWin();

const starts = seedRanges.sort((a, b) => a.start - b.start);

// console.log(starts);

//115756317 to  3541110360 is too high

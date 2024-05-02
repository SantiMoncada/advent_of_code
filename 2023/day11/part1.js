//@ts-check
const { readFileSync } = require("fs");

/**
 * @param {string} input
 * @returns {string[][]}
 */
function parseInput(input) {
  const lines = input.trim().split("\n");

  const ouput = [];
  for (const line of lines) {
    ouput.push(line.split(""));
  }

  return ouput;
}

/**
 * @param {string[][]} rawImage
 * @returns {{emptyRows:number[],emptyCols:number[]}}
 */
function getEmptyLines(rawImage) {
  const emptyRows = [];

  outer: for (let i = 0; i < rawImage.length; i++) {
    for (let j = 0; j < rawImage[i].length; j++) {
      const char = rawImage[i][j];
      if (char === "#") {
        continue outer;
      }
      if (j === rawImage[i].length - 1) {
        emptyRows.push(i);
      }
    }
  }

  const emptyCols = [];

  outer: for (let i = 0; i < rawImage[0].length; i++) {
    for (let j = 0; j < rawImage.length; j++) {
      const char = rawImage[j][i];
      if (char === "#") {
        continue outer;
      }
      if (j === rawImage.length - 1) {
        emptyCols.push(i);
      }
    }
  }

  return {
    emptyRows,
    emptyCols,
  };
}

/**
 * @param {string[][]} image
 */
function getGalaxyCoords(image) {
  const galaxys = [];
  for (let i = 0; i < image.length; i++) {
    for (let j = 0; j < image[i].length; j++) {
      const unit = image[i][j];
      if (unit === "#") {
        galaxys.push({ i, j });
      }
    }
  }
  return galaxys;
}

/**
 * @param {string[][]} image
 */
function expandSpace(image) {
  const { emptyCols, emptyRows } = getEmptyLines(image);

  console.log({ emptyCols, emptyRows });

  let rowOffset = 0;
  const rowLenght = image[0].length;
  for (const emptyRow of emptyRows) {
    const newRow = Array(rowLenght).fill("*");
    image.splice(emptyRow + rowOffset, 0, newRow);
    rowOffset++;
  }

  let colOffset = 0;
  for (const emptyCol of emptyCols) {
    for (let i = 0; i < image.length; i++) {
      image[i].splice(emptyCol + colOffset, 0, "*");
    }
    colOffset++;
  }
}

/**
 * @param {string[][]} image
 */
function printImage(image) {
  for (let i = 0; i < image.length; i++) {
    let line = "";
    for (let j = 0; j < image[i].length; j++) {
      line += image[i][j];
    }
    console.log(line);
  }
}

/**
 *
 * @param {{i:number,j:number}} galaxyA
 * @param {{i:number,j:number}} galaxyB
 */
function getDistance(galaxyA, galaxyB) {
  const iDistance = Math.abs(galaxyA.i - galaxyB.i);

  const jDistance = Math.abs(galaxyA.j - galaxyB.j);

  return iDistance + jDistance;
}

const INPUT = readFileSync("./input.txt", "utf8");

const rawImage = parseInput(INPUT);

expandSpace(rawImage);

const galaxys = getGalaxyCoords(rawImage);

let count = 0;
for (let i = 0; i < galaxys.length - 1; i++) {
  for (let j = i + 1; j < galaxys.length; j++) {
    count += getDistance(galaxys[i], galaxys[j]);
  }
}

console.log({ count });

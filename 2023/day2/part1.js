const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

function parseInput(input) {
  let blocks = input.split("\n");

  blocks = blocks.map((block) => {
    return block.split(":")[1].trim().split(";");
  });

  let games = blocks.map((game) => {
    return game.map((play) => {
      return play.split(",").map((result) => {
        return result.trim();
      });
    });
  });

  games = games.map((play) => {
    return play.map((result) => {
      const aux = {};
      for (const idk of result) {
        const idkSplited = idk.split(" ");
        aux[idkSplited[1]] = parseInt(idkSplited[0]);
      }

      return aux;
    });
  });

  return games
}

const games = parseInput(INPUT);

const currentCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

let acc = 0;
let gameNumber = 1;
for (const game of games) {
  let isPosible = true;
  for (const play of game) {
    if (!isPlayPosible(currentCubes, play)) {
      isPosible = false;
      break;
    }
  }

  console.log({ isPosible, game });
  if (isPosible) {
    acc += gameNumber;
  }

  gameNumber++;
}

console.log({ acc });

function isPlayPosible(avilableBlocks, currentBlocks) {
  for (const [color, amount] of Object.entries(currentBlocks)) {
    if (avilableBlocks[color] === undefined) {
      return false;
    }

    if (avilableBlocks[color] < amount) {
      return false;
    }
  }
  return true;
}

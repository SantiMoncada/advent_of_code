console.log("------------------------------------");
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

let blocks = INPUT.split("\n");

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

function getPowerOfPlay(game) {
  const minBlocks = {};
  for (const play of game) {
    for (const [color, amount] of Object.entries(play)) {
      if (minBlocks[color] === undefined) {
        minBlocks[color] = amount;
      } else {
        minBlocks[color] = Math.max(minBlocks[color], amount);
      }
    }
  }

  let acc = 1;
  for (const [_, value] of Object.entries(minBlocks)) {
    acc *= value;
  }

  console.log({ minBlocks });
  return acc;
}

let acc = 0;
games.map((play) => {
  acc += getPowerOfPlay(play);
});

console.log({ acc });

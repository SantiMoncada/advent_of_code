//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @typedef {{
 *  hand : string,
 *  bid: number,
 * }} Play
 */

/**
 * @param {string} input
 * @returns {Play[]}
 */
function parseInput(input) {
  const lines = input.trim().split("\n");
  /**
   * @type {Play[]}
   */
  const data = [];
  for (const line of lines) {
    const [hand, bid] = line.split(" ");
    data.push({
      hand,
      bid: parseInt(bid),
    });
  }

  return data;
}

/**
 * Returns true when hand1 stronger than hand2 if equals returns true
 *
 * @param {string} hand1
 * @param {string} hand2
 *
 * @returns {number}
 */
function compareRaw(hand1, hand2) {
  const cardValue = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
  };

  if (hand1.length !== 5 || hand2.length !== 5) {
    throw new Error("Not valid hands");
  }

  for (let i = 0; i < 5; i++) {
    const card1Value = cardValue[hand1[i]];
    const card2Value = cardValue[hand2[i]];

    if (card1Value === undefined || card2Value === undefined) {
      throw new Error(`Not valid card`);
    }

    if (card1Value > card2Value) {
      return 1;
    } else if (card1Value < card2Value) {
      return -1;
    }
  }
  return 0;
}

/**
 * @param {string} hand
 *
 * Five of a kind  -> 7
 * Four of a kind  -> 6
 * Full house      -> 5
 * Three of a kind -> 4
 * Two pair        -> 3
 * One pair        -> 2
 * High card       -> 1
 * @returns {number}
 */
function handKind(hand) {
  if (hand.length !== 5) {
    throw new Error("Not valid hand");
  }

  const count = {};

  for (const card of hand) {
    if (count[card] === undefined) {
      count[card] = 1;
    } else {
      count[card]++;
    }
  }

  const numberList = Object.values(count).sort((a, b) => b - a);

  if (numberList[0] === 5) {
    return 7;
  }

  if (numberList[0] === 4) {
    return 6;
  }

  if (numberList[0] === 3 && numberList[1] === 2) {
    return 5;
  }

  if (numberList[0] === 3) {
    return 4;
  }

  if (numberList[0] === 2 && numberList[1] === 2) {
    return 3;
  }

  if (numberList[0] === 2) {
    return 2;
  }

  if (numberList[0] === 1) {
    return 1;
  }

  throw new Error("Parsing hand");
}

/**
 * Returns true when hand1 stronger than hand2 if equals returns true
 *
 * @param {string} hand1
 * @param {string} hand2
 *
 * @returns {number}
 */
function compare(hand1, hand2) {
  const kind1 = handKind(hand1);
  const kind2 = handKind(hand2);

  if (kind1 > kind2) {
    return 1;
  }

  if (kind2 > kind1) {
    return -1;
  }

  if (kind1 === kind2) {
    return compareRaw(hand1, hand2);
  }

  throw new Error("Error comparing");
}

const plays = parseInput(INPUT);
const sortedPlays = plays.sort((a, b) => compare(a.hand, b.hand));

let total = 0;
let rank = 1;
for (const play of sortedPlays) {
  total += play.bid * rank;
  rank++;
}

console.log(total);

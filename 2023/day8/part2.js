//@ts-check
const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

/**
 * @typedef {Object} Connection
 * @property {string} left
 * @property {string} right
 */

/**
 * @typedef {Object.<string, Connection>} NetworkMap
 */

/**
 * @typedef {Object} Maps
 * @property {string} instructions
 * @property {NetworkMap} networkMap
 */

/**
 * @param {string} input
 * @returns {Maps}
 */
function parseInput(input) {
  const lines = input.trim().split("\n");
  const instructions = lines.shift();

  if (instructions === undefined) {
    throw new Error("No instructions");
  }

  lines.shift();

  /**
   * @type {NetworkMap}
   */
  const data = {};
  for (const line of lines) {
    const [currentNode, destinationNodes] = line.split(" = ");

    const [left, right] = destinationNodes.slice(1, -1).split(", ");

    data[currentNode] = { left, right };
  }

  return { networkMap: data, instructions };
}

const { networkMap, instructions } = parseInput(INPUT);

/**
 * @type {string[]}
 */
let currentNodes = [];

//setting current nodes

for (const node of Object.keys(networkMap)) {
  if (node[2] === "A") {
    currentNodes.push(node);
  }
}

/**
 *
 * @param {string} currentNode
 * @param {string} instructions
 * @param {NetworkMap} networkMap
 */
function getDistanceToZ(currentNode, instructions, networkMap) {
  let i = 0;
  let steps = 0;

  while (true) {
    i = i % instructions.length;

    if (currentNode[2] === "Z") {
      break;
    }

    const currentInst = instructions[i];

    if (currentInst === "L") {
      currentNode = networkMap[currentNode].left;
    }

    if (currentInst === "R") {
      currentNode = networkMap[currentNode].right;
    }

    i++;
    steps++;
  }

  return steps;
}

let currentNode = currentNodes[0];
const computed = [];
for (const node of currentNodes) {
  console.log({ node });
  computed.push(getDistanceToZ(node, instructions, networkMap));
}

console.log(computed);

console.log(smallestCommons(computed));

//then i used

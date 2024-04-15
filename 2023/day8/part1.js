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


let currentNode = "AAA";
let i = 0;
let steps = 0;
while(true){
  i = i % instructions.length;
 
  console.log({currentNode})
  if(currentNode === 'ZZZ'){
    break
  }

  const currentInst = instructions[i];
  
  if(currentInst === "L"){
    currentNode = networkMap[currentNode].left
  }

  if(currentInst === "R"){
    currentNode = networkMap[currentNode].right
  }

  i++;
  steps++;
}


console.log(steps)

//@ts-check
const { readFileSync } = require("fs");

/**
 * @param {string} str
 * @param {number} index
 * @param {string} chr
 * @returns {string}
 */
function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

/**

 * @param {Spring} spring
 * @returns {Spring}
 */
function expandSpring(spring) {
  const newList = [];
  for (let i = 0; i < 5; i++) {
    newList.push(...spring.list);
  }

  let newRow = "";

  for (let i = 0; i < 5; i++) {
    newRow += spring.row;

    if (i === 4) {
      break;
    }

    newRow += "?";
  }

  return { list: newList, row: newRow };
}

/**
 * @typedef {{row:string, list:number[]}} Spring
 */
/**
 * @param {string} input
 * @returns {Spring[]}
 */
function parseInput(input) {
  const lines = input.trim().split("\n");

  const ouput = [];
  for (const line of lines) {
    const [row, list] = line.split(" ");

    ouput.push(
      expandSpring({
        row,
        list: list
          .trim()
          .split(",")
          .map((e) => parseInt(e)),
      })
    );
  }

  return ouput;
}

/**
 *
 * @param {string} row
 * @param {number[]} list
 * @returns {boolean}
 */
function couldBeValid(row, list) {
  let counter = 0;
  let listPosition = 0;
  const currentList = [];

  for (const char of row) {
    switch (char) {
      case "#":
        counter += 1;
        break;
      case ".":
        if (counter !== 0) {
          if (list[listPosition] !== counter) {
            return false;
          }
          currentList.push(counter);
          listPosition++;
        }
        counter = 0;
        break;
      case "?":
        return true;
    }
  }
  if (counter !== 0) {
    if (list[listPosition] !== counter) {
      return false;
    }
    currentList.push(counter);
  }

  if (list.length < listPosition) {
    return false;
  }

  if (!row.includes("?")) {
    if (list.length !== currentList.length) {
      return false;
    }

    for (let i = 0; i < list.length; i++) {
      if (list[i] !== currentList[i]) {
        return false;
      }
    }
  }

  return true;
}

/**
 * @param {string} row
 * @param {number[]} list
 * @returns {string[]}
 */
function generateAllVariations(row, list) {
  if (!couldBeValid(row, list)) {
    return [];
  }

  if (!row.includes("?")) {
    return [row];
  }
  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === "?") {
      let rowWorking = row;
      let rowDamage = row;

      rowWorking = setCharAt(rowWorking, i, ".");
      rowDamage = setCharAt(rowDamage, i, "#");

      return [
        ...generateAllVariations(rowWorking, list),
        ...generateAllVariations(rowDamage, list),
      ];
    }
  }

  return [];
}

/**
 * @param {string} row
 * @param {number[]} list
 * @returns {number}
 */
function generateAllVariationsIterative(row, list) {
  let variations = 0;
  const stack = [];
  stack.push(row);

  stackLoop: while (stack.length !== 0) {
    const currentRow = stack.pop();

    let counter = 0;
    const newList = [];

    for (let i = 0; i < currentRow.length; i++) {
      const spring = currentRow[i];
      switch (spring) {
        case "#":
          counter++;
          break;
        case ".":
          if (counter !== 0) {
            newList.push(counter);
            counter = 0;
          }
          break;
        case "?":
          let rowWorking = currentRow;
          let rowDamage = currentRow;

          rowWorking = setCharAt(rowWorking, i, ".");
          rowDamage = setCharAt(rowDamage, i, "#");
          stack.push(rowWorking);
          stack.push(rowDamage);
          continue stackLoop;
      }
    }

    if (counter !== 0) {
      newList.push(counter);
    }

    if (list.length === newList.length) {
      let listIsEqual = true;
      for (let i = 0; i < newList.length; i++) {
        if (list[i] !== newList[i]) {
          listIsEqual = false;
          break;
        }
      }

      if (listIsEqual) {
        // console.log(currentRow);
        variations++;
      }
    }
  }

  return variations;
}

const INPUT = readFileSync("./testInput.txt", "utf8");
const data = parseInput(INPUT);

const testRow =
  "????.######..#####.?????.######..#####.?????.######..#####.?????.######..#####.?????.######..#####.";
const testList = [1, 6, 5, 1, 6, 5, 1, 6, 5, 1, 6, 5, 1, 6, 5];

console.time("generateAllVariations");
const ye = generateAllVariations(testRow, testList);
console.timeEnd("generateAllVariations");
console.log(ye.length);

console.time("generateAllVariationsIterative");
const yeet = generateAllVariationsIterative(testRow, testList);

console.timeEnd("generateAllVariationsIterative");

console.log(yeet);

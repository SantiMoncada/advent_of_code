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
    let listPosition = 0;

    for (let i = 0; i < currentRow.length; i++) {
      switch (currentRow[i]) {
        case "#":
          counter++;
          break;
        case ".":
          if (counter !== 0) {
            if (list[listPosition] !== counter) {
              continue stackLoop;
            }
            newList.push(counter);
            listPosition++;
          }
          counter = 0;
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

/**
 * @param {string} row
 * @param {number[]} list
 * @returns {number}
 */
function generateAllVariationsDynamic(row, list) {
  if (row === "" && list.length === 0) {
    return 1;
  }

  if (row === "" && list.length > 0) {
    return 0;
  }

  if (list.length === 0 && row.length !== 0) {
    if (row.includes("#")) {
      return 0;
    } else {
      return 1;
    }
  }

  if (row[0] === ".") {
    return generateAllVariationsDynamic(row.slice(1), list);
  }

  const window = list[0];

  if (row[0] === "#") {
    if (!row.slice(0, window).includes(".") && row[window] !== "#") {
      return generateAllVariationsDynamic(row.slice(window + 1), list.slice(1));
    } else {
      return 0;
    }
  }

  if (row[0] === "?") {
    let value = 0;

    if (row.length >= window) {
      if (!row.slice(0, window).includes(".") && row[window] !== "#") {
        value += generateAllVariationsDynamic(
          row.slice(window + 1),
          list.slice(1)
        );
      }
    }

    value += generateAllVariationsDynamic(row.slice(1), list);
    return value;
  }
  console.log({ row, list });

  throw new Error("should not be here");
}

const INPUT = readFileSync("./input.txt", "utf8");
const data = parseInput(INPUT);

const i = 2;
const testRow = data[i].row;

const testList = data[i].list;

console.time("generateAllVariationsDynamic");
console.log(generateAllVariationsDynamic(testRow, testList));
console.timeEnd("generateAllVariationsDynamic");

console.time("generateAllVariationsIterative");
console.log(generateAllVariationsIterative(testRow, testList));
console.timeEnd("generateAllVariationsIterative");

console.time("generateAllVariations");
console.log(generateAllVariations(testRow, testList).length);
console.timeEnd("generateAllVariations");

// let count = 0;
// data.forEach((row) => {
//   console.time("generateAllVariations");
//   const value = generateAllVariationsIterative(row.row, row.list);
//   console.timeEnd("generateAllVariations");
//   count += value;
//   console.log(value);
// });
// console.log(count);

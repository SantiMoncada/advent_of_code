const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const parsedInput = INPUT.split("\n");

class treeNode {
  constructor(name, parent) {
    this.name = name;
    this.totalSize = 0;
    this.files = [];
    this.parent = parent;
    this.childs = [];
  }

  addChild(node) {
    this.childs.push(node);
  }

  addFile(file) {
    this.files.push(file);
  }

  findChild(nodeName) {
    return this.childs.find((node) => {
      return node.name === nodeName;
    });
  }
}

const root = new treeNode("root", null);
let currentNode = root;

for (let i = 0; i < parsedInput.length; i++) {
  const line = parsedInput[i];

  command = line.split(" ");

  if (command[0] === "$") {
    switch (command[1]) {
      case "ls":
        break;
      case "cd":
        switch (command[2]) {
          case "/":
            currentNode = root;
            break;
          case "..":
            currentNode = currentNode.parent;

            break;
          default:
            const name = command[2];

            const output = currentNode.findChild(name);
            currentNode = currentNode.findChild(name);
            break;
        }
    }
  } else if (command[0] === "dir") {
    //dir
    const dir = new treeNode(command[1], currentNode);
    currentNode.addChild(dir);
  } else {
    //file
    const file = command;
    currentNode.addFile(file);
  }
}

const calculateTotalSize = (node) => {
  let total = 0;
  node.files.forEach((file) => {
    total += Number(file[0]);
  });

  node.childs.forEach((child) => {
    total += Number(calculateTotalSize(child));
  });

  node.totalSize = total;

  return node.totalSize;
};

calculateTotalSize(root);

let total = 0;
const dfs = (node) => {
  console.log("name->", node.name, " size->", node.totalSize);
  if (node.totalSize <= 100000) {
    total += node.totalSize;
  }
  node.childs.forEach((child) => {
    dfs(child);
  });
};

dfs(root);
console.log({ total });

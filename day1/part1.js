const { readFileSync } = require("fs");

const start = performance.now();

const INPUT = readFileSync("./input.txt", "utf8");

const bloques = INPUT.split("\n\n");

const bloquePartidos = bloques.map((bloque) => bloque.split("\n"));

const lineas = bloquePartidos.map((bloque) =>
  bloque.reduce((a, b) => Number(a) + Number(b), 0)
);

const result = Math.max(...lineas);

const end = performance.now();
const time = end - start;

console.log(result);

console.log("time in ns: " + time);

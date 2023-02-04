const { readFileSync } = require("fs");

const INPUT = readFileSync("./input.txt", "utf8");

const bloques = INPUT.split("\n\n");

const bloquePartidos = bloques.map((bloque) => bloque.split("\n"));

let lineas = bloquePartidos.map((bloque) =>
  bloque.reduce((a, b) => Number(a) + Number(b), 0)
);

lineas.sort((a, b) => a - b);

console.log(
  lineas[lineas.length - 1] +
    lineas[lineas.length - 2] +
    lineas[lineas.length - 3]
);

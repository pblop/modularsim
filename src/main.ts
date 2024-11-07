import type Config from "./types/config.js";

const config: Config = {
  simulator: {
    name: "Simulator",
    url: "/m6809/base.js",
    modules: [
      {
        name: "Memory",
        type: "memory",
        url: "/m6809/memory.js",
        config: {
          size: 0x10000,
        },
      },
    ],
  },
  extensions: [
    {
      name: "Extension 1",
      url: "/exts/extension1.js",
      config: {
        foo: "bar",
      },
    },
  ],
  programs: [
    {
      name: "Hola Mundo",
      url: "/progs/hola-mundo.s19",
    },
  ],
};

console.log(config.simulator.name);
const { add } = await import(config.simulator.url);
console.log(add(1, 2));

let message: string = "Hello World";
console.log(message);

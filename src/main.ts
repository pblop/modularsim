import type Config from "types/config.js";

const config: Config = {
  simulator: {
    name: "Simulator",
    url: "m6809/base.js",
    modules: [
      {
        name: "Memory",
        type: "memory",
        url: "m6809/memory.js",
        config: {
          size: 0x10000,
        },
      },
    ],
  },
  views: [
    {
      name: "Extension 1",
      url: "exts/extension1.js",
      config: {
        foo: "bar",
      },
    },
  ],
  programs: [
    {
      name: "Hola Mundo",
      url: "progs/hola-mundo.s19",
    },
  ],
};

console.log(config.simulator.name);
const { add } = await import(config.simulator.url);
console.log(add(1, 2));

let message: string = "Hello World";
console.log(message);

async function loadConfigFromUrl(url: string): Promise<Config> {
  const response = await fetch(url);
  return response.json();
}

// Load config from URL
const query = new URLSearchParams(window.location.search);
const configUrl = query.get("config");
if (configUrl) {
  console.log("Cargando la configuración de la url: " + configUrl);
  const config2 = await loadConfigFromUrl(configUrl);
  console.info("Cargada la configuración de la url: ", config2);
}

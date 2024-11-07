import type Config from "./types/config.js";
import ISimulator from "./types/simulator";

async function loadConfigFromUrl(url: string): Promise<Config> {
  const response = await fetch(url);
  return response.json();
}

// Load config from URL
const query = new URLSearchParams(window.location.search);
const configUrl = query.get("config") ?? "config.json";
console.log("Cargando la configuración de la url: " + configUrl);
const config = (await loadConfigFromUrl(configUrl)) as Config;

// Load simulator
const Simulator = (await import(config.simulator.url)).default as ISimulator;
const simulator = new Simulator(config.simulator);

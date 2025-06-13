import type { Config, ModuleConfig } from "../types/config.js";
import type { ModuleConstructor } from "../types/module.js";
import type { ISimulator, SimulatorConstructor } from "../types/simulator.js";

const DEFAULT_CONFIG_URL = "config.jsonc";

export default class Controller {
  simulator?: ISimulator;

  async initFromUrl(url: string = this.getConfigURL()): Promise<void> {
    const config = await this.loadConfigFromUrl(url);
    await this.init(config);
  }

  async init(config: Config): Promise<void> {
    // Load the code for the simulator, and for the modules (these are loaded in
    // parallel).
    const Simulator = (await import(config.simulator.url)).default as SimulatorConstructor;
    this.loadModulesCss(config.simulator.modules);
    const modules = await this.loadModulesJs(config.simulator.modules);
    // Create the actual simulator instance, it will load the modules, and
    // verify its own config.
    const simulator = new Simulator(config.simulator, modules);
    this.simulator = simulator;

    // Debug, testing.
    // simulator.on("memory:read:result", (ctx, address, data) => {
    //   console.info(
    //     "Controller",
    //     `Memory read at 0x${address.toString(16)} returned 0x${data.toString(16)}`,
    //   );
    // });
  }

  getConfigURL(): string {
    // Load config from the config url (default or from query string).
    const query = new URLSearchParams(window.location.search);
    return query.get("config") ?? DEFAULT_CONFIG_URL;
  }
  async loadConfigFromUrl(url: string): Promise<Config> {
    const response = await fetch(url);
    const jsonc = await response.text();
    // Using the json comment stripper found in the json-easy-strip npm module.
    // https://github.com/tarkh/json-easy-strip/blob/master/index.js
    const json = jsonc.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
      g ? "" : m,
    );
    return JSON.parse(json);
  }

  // Load the modules' js in parallel.
  async loadModulesJs(modules: ModuleConfig[]): Promise<ModuleConstructor[]> {
    const promises = [];

    for (const module of modules) {
      promises.push(this.loadModuleJs(module));
    }

    return await Promise.all(promises);
  }
  loadModulesCss(modules: ModuleConfig[]): void {
    // Using a set to avoid loading the same css multiple times.
    const css_urls = new Set<string>();
    for (const module of modules) {
      if (module.css) {
        for (const url of module.css) {
          css_urls.add(url);
        }
      }
    }

    for (const url of css_urls) {
      console.debug("[Controller]", `Loading css from ${url}`);
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      document.head.appendChild(link);
    }
  }
  async loadModuleJs(module_config: ModuleConfig): Promise<ModuleConstructor> {
    console.debug(
      "[Controller]",
      `Loading module ${module_config.id}'s js from ${module_config.url}`,
    );
    const Module = (await import(module_config.url)).default as ModuleConstructor;

    return Module;
  }
}

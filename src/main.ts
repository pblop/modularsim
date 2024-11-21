import type { ModuleConfig, Config } from "./types/config.js";
import type { ISimulator, SimulatorConstructor } from "./general/simulator.js";
import type { ModuleConstructor } from "./general/module.js";

const DEFAULT_CONFIG_URL = "config.json";

class Controller {
  simulator?: ISimulator;

  async init() {
    // Load config from URL
    const configUrl = this.getConfigURL();
    const config = await this.loadConfigFromUrl(configUrl);

    // Load the code for the modules and the simulator.
    const Simulator = (await import(config.simulator.url)).default as SimulatorConstructor;
    const modules = await this.loadModules(config.simulator.modules);
    const simulator = new Simulator(config.simulator, modules);
    this.simulator = simulator;

    // Debug, testing.
    simulator.on("memory:read:result", (address, data) => {
      console.info(
        "Controller",
        `Memory read at 0x${address.toString(16)} returned 0x${data.toString(16)}`,
      );
    });
    simulator.emit("memory:read", 0x1000);
    simulator.emit("memory:write", 0x1000, 0x10);
    simulator.emit("memory:read", 0x1000);
  }

  getConfigURL(): string {
    const query = new URLSearchParams(window.location.search);
    return query.get("config") ?? DEFAULT_CONFIG_URL;
  }
  async loadConfigFromUrl(url: string): Promise<Config> {
    const response = await fetch(url);
    return response.json();
  }

  // Load the modules in parallel.
  async loadModules(modules: ModuleConfig[]): Promise<ModuleConstructor[]> {
    const promises = [];
    for (const module of modules) {
      promises.push(this.loadModule(module));
    }
    return await Promise.all(promises);
  }
  async loadModule(module_config: ModuleConfig): Promise<ModuleConstructor> {
    console.debug("Controller", `Loading module ${module_config.name} from ${module_config.url}`);
    const Module = (await import(module_config.url)).default as ModuleConstructor;
    return Module;
  }
}

const controller = new Controller();
controller.init();
// @ts-ignore
window.controller = controller;

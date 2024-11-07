import { SimulatorConfig, ModuleConfig } from "../types/config.js";
import { IModule, ModuleBase, ModuleConstructor } from "../general/module.js";
import { SimulatorBase } from "../general/simulator.js";

// NOTA: Ahora mismo estoy utilizando un método init para cargar los módulos y
// preparar el simulador. Veo otras opciones:
// - Crear un método estático para cargar los módulos, y una vez cargados,
//   crear una instancia del simulador, y que él los inicialice.
// - Cargar la configuración en el constructor del simulador, hacer comprobaciones
//   ahí, y luego cargar los módulos en un método init.

class M6809Simulator extends SimulatorBase {
  modules: IModule[] = [];
  constructor(config: SimulatorConfig, modules: ModuleConstructor[]) {
    super(config, modules);
    console.log("Initializing M6809 simulator");

    // Check that the config has the required fields.
    if (!config.modules) throw new Error("No modules defined");

    for (let i = 0; i < config.modules.length; i++) {
      const module_config = config.modules[i];
      const Module = modules[i];

      const module = new Module(module_config.config);
      this.modules.push(module);
    }
  }
}

export default M6809Simulator;

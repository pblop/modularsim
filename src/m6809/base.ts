import { SimulatorConfig } from "../types/config";
import { SimulatorBase } from "../types/simulator";

class M6809Simulator extends SimulatorBase {
  constructor(config: SimulatorConfig) {
    super();
    console.debug("Loading M6809 simulator");

    // Load modules
    if (!config.modules) throw new Error("No modules defined");

    for (const module of config.modules) {
      console.debug(`Loading module ${module.name} from ${module.url}`);
      // TODO: Load module
    }
  }
  something(): void {
    throw new Error("Method not implemented.");
  }
}

export default M6809Simulator;

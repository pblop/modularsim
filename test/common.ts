import M6809Simulator from "../src/m6809/base.ts";
import Cpu from "../src/m6809/hardware/cpu.ts";
import type { EventDeclaration, TypedEventTransceiver } from "../src/types/event";
import type { IModule, ModuleConstructor } from "../src/types/module.d.ts";

export function generateCpuOnlySimulator() {
  const config = {
    url: "",
    modules: [
      {
        id: "cpu",
        type: "",
        url: "",
        config: {
          pc: 0x10e,
        },
      },
      {
        id: "events",
        type: "",
        url: "",
      },
    ],
  };

  /**
   * A module that provides the events the CPU requires so that the simulator doesn't
   * throw an error on initialisation, and also kickstarts the system.
   */
  class EventDeclarator implements IModule {
    getEventDeclaration(): EventDeclaration {
      return {
        provided: [
          "clock:cycle_start",
          "signal:reset",
          "memory:read:result",
          "memory:write:result",
        ],
        required: {},
      };
    }
  }
  const modules = [Cpu as ModuleConstructor, EventDeclarator as ModuleConstructor];

  const simulator = new M6809Simulator(config, modules);
  // NOTE: As of now, the simulator is initialised purely synchronously, so we can
  // take the returned simulator object as a completely initialised simulator.
  return simulator;
}

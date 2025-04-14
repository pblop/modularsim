import M6809Simulator from "../src/modules/simulator.ts";
import Cpu from "../src/modules/m6809/cpu/cpu.ts";
import type { EventDeclaration, TypedEventTransceiver } from "../src/types/event.d.ts";
import type { IModule, ModuleConstructor, ModuleDeclaration } from "../src/types/module.d.ts";

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
   * A module that provides the declaration the CPU requires so that the simulator doesn't
   * throw an error on initialisation, and also kickstarts the system.
   */
  class TestingModule implements IModule {
    getModuleDeclaration(): ModuleDeclaration {
      return {
        events: {
          provided: ["signal:reset", "memory:read:result", "memory:write:result"],
          required: {},
        },
        cycles: {
          initiator: true,
        },
      };
    }
  }
  const modules = [Cpu as ModuleConstructor, TestingModule as ModuleConstructor];

  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};

  const simulator = new M6809Simulator(config, modules);
  // NOTE: As of now, the simulator is initialised purely synchronously, so we can
  // take the returned simulator object as a completely initialised simulator.
  return simulator;
}

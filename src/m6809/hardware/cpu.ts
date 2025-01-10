import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { type Instruction, parseInstruction } from "../util/instructions.js";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type CpuConfig = {};

enum CpuState {
  UNINITIALISED = 0, // Pre-reset
  NO_INSTRUCTION = 1, //
  WAIT_FETCH_READ = 2, //
}

function validate_cpu_config(config: Record<string, unknown>): CpuConfig {
  return config as CpuConfig;
}

class Cpu implements IModule {
  id: string;
  config: CpuConfig;
  et: TypedEventTransceiver;

  interval_id?: number;

  state: CpuState;
  waitCycles: number;

  pc: number;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["cpu:instruction_finish"],
      required: {
        "clock:cycle_start": () => {},
        "signal:reset": this.reset,
        "memory:read:result": () => {},
        "memory:write:result": () => {},
      },
      optional: {},
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown>,
    eventTransceiver: TypedEventTransceiver,
  ) {
    this.id = id;
    this.config = validate_cpu_config(config);
    this.et = eventTransceiver;

    this.state = CpuState.UNINITIALISED;
    this.waitCycles = 0;
    this.pc = 0;

    console.log(`[${this.id}] Module initialized.`);
  }

  reset = () => {
    this.state = CpuState.NO_INSTRUCTION;
    this.waitCycles = -1;

    this.pc = 0x1000;

    this.loop();
  };

  loop = async () => {
    if (this.state === CpuState.UNINITIALISED)
      throw new Error(`[${this.id}] Tried to execute, but didn't receive reset`);
    // We must be running

    /* Fetch & Decode */
    const instructionBytes: number[] = [];
    let result: string | Instruction | null = "partial";
    while (result === "partial") {
      // TODO: Maybe do some comparison that the read address is the correct one?
      // Maybe not needed, never will happen.
      const [_, byte] = await this.et.emitAndWait("memory:read", "memory:read:result", this.pc++);
      if (byte == null) throw new Error(`[${this.id}] undefined!!!`);
      instructionBytes.push(byte);

      /* Decode */
      result = parseInstruction(instructionBytes);
    }
    if (result === null) throw new Error(`[${this.id}] invalid instruction encoutered`);

    /* Execute */
    console.log(result);
  };
}

export default Cpu;

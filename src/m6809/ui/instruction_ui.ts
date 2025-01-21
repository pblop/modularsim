import type { IModule } from "../../types/module.js";
import type { ISimulator } from "../../types/simulator.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import {
  AddressableAddressingMode,
  type InstructionData,
  INSTRUCTIONS,
} from "../util/instructions.js";
import { element } from "../../utils.js";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type InstructionUIConfig = {};

function validateMemoryUIConfig(config: Record<string, unknown>): InstructionUIConfig {
  return config as InstructionUIConfig;
}

// async function addressing<T extends AddressableAddressingMode>(
//   ui: InstructionUI,
//   address: number,
//   dp: number,
//   mode: T,
// ): Promise<T extends "immediate" ? "pc" : number> {
//   type ReturnType = T extends "immediate" ? "pc" : number;

//   switch (mode) {
//     case "immediate":
//       return "pc" as ReturnType;
//     case "direct": {
//       const low = await ui.read(address, 1);

//       return ((dp << 8) | low) as ReturnType;
//     }
//     case "indexed": {
//       const postbyte = await ui.read(address, 1);

//       return (await indexedAddressing(cpu, postbyte)) as ReturnType;
//     }
//     case "extended": {
//       const address = await ui.read(address, 2);
//       return address as ReturnType;
//     }
//     case "relative": {
//       // Only used for branches
//       const offset = await cpu.read(cpu.registers.pc, 1);
//       cpu.registers.pc += 1;
//       return truncate(cpu.registers.pc + signExtend(offset, 8, 16), 16) as ReturnType;
//     }
//   }
//   throw new Error("[instruction-ui] Unknown addressing mode passed to addressing function");
// }
type DecompiledInstruction = {
  startAddress: number;
  opcode: number;
  instruction: InstructionData;
  arguments: number[];
  size: number;
};
async function decompileInstruction(
  // we assume this _read_ function reads big-endian, and reads 1 byte by default.
  read: (address: number, bytes?: number) => Promise<number>,
  address: number,
): Promise<DecompiledInstruction | null> {
  const opcodeBytes = [];
  const args = [];
  let size = 1;

  // Fetch the opcode
  opcodeBytes.push(await read(address));
  if (opcodeBytes[0] === 0x10 || opcodeBytes[0] === 0x11) {
    opcodeBytes.push(await read(address + 1));
    size++;
  }
  const opcode = opcodeBytes.reduce((acc, byte) => (acc << 8) | byte, 0);

  // Find the instruction
  if (!INSTRUCTIONS[opcode]) return null;
  const instruction = INSTRUCTIONS[opcode];

  // Perform addressing.
  // TODO: Implement addressing

  return {
    startAddress: address,
    opcode,
    instruction,
    arguments: [],
    size,
  };
}

class InstructionUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  pc: number;

  panel?: HTMLElement;
  rows: HTMLDivElement[];

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["ui:memory:read"],
      required: {
        "ui:memory:read:result": () => {},
        "gui:panel_created": this.onGuiPanelCreated,
        "cpu:register_update": this.onRegisterUpdate,
      },
      optional: {},
    };
  }

  constructor(
    id: string,
    config: Record<string, unknown> | undefined,
    eventTransceiver: TypedEventTransceiver,
  ) {
    // We use the simulator to emit/receive events.
    this.et = eventTransceiver;
    this.id = id;

    this.pc = 0;
    this.rows = [];

    if (!config) throw new Error(`[${this.id}] No configuration provided`);
    this.config = validateMemoryUIConfig(config);

    console.log(`[${this.id}] Memory Initializing module.`);
  }

  /**
   * Wrapper around the event emitter to read bytes from memory (big-endian).
   */
  read = async (address: number, bytes = 1) => {
    let val = 0;

    for (let i = 0; i < bytes; i++) {
      // TODO: Maybe do some comparison that the read address is the correct one?
      const [_, data] = await this.et.emitAndWait(
        "ui:memory:read",
        "ui:memory:read:result",
        address + i,
      );
      if (data == null) throw new Error(`[${this.id}] read an undefined byte!1!!`);

      val = (val << 8) | data;
    }

    return val;
  };

  onGuiPanelCreated = (panel_id: string, panel: HTMLElement): void => {
    if (this.id !== panel_id) return;
    console.log(`[${this.id}] obtained GUI panel`);

    this.panel = panel;
    this.panel.classList.add("instruction-ui");

    for (let i = 0; i < 16; i++) {
      const row = element("div", {
        properties: { className: "row" },
        children: [
          element("span", {
            properties: { className: "address", innerText: "0000" },
          }),
          element("span", { properties: { className: "data", innerText: "..." } }),
        ],
      });

      this.panel.appendChild(row);
      this.rows.push(row);
    }
  };
  onRegisterUpdate = (register: string, value: number): void => {
    if (!this.panel) return;

    if (register === "pc") {
      this.pc = value;
      this.populatePanel();
    }
  };

  formatAddress(data: number): string {
    return data.toString(16).padStart(4, "0");
  }

  async populatePanel(): Promise<void> {
    if (!this.panel) return;

    const startAddress = this.pc;
    let currentAddress = startAddress;
    let failed = false;
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];

      // If we failed to decompile the instruction, we just show "??", and we stop
      // trying to decompile the rest of the instructions.
      if (failed) {
        (row.children[0] as HTMLDivElement).innerText = "....";
        (row.children[1] as HTMLDivElement).innerText = "??";
        continue;
      }

      const decompiled = await decompileInstruction(this.read, currentAddress);
      if (!decompiled) {
        failed = true;
        (row.children[0] as HTMLDivElement).innerText = "....";
        (row.children[1] as HTMLDivElement).innerText = "??";
        continue;
      }

      (row.children[0] as HTMLDivElement).innerText = this.formatAddress(currentAddress);
      (row.children[1] as HTMLDivElement).innerText = decompiled.instruction.mnemonic;

      currentAddress += decompiled.size;
    }
  }
}

export default InstructionUI;

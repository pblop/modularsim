import type { IModule } from "../../types/module.js";
import type { EventDeclaration, TypedEventTransceiver } from "../../types/event.js";
import { REGISTER_SIZE, type Registers } from "../util/cpu_parts.js";
import {
  type InstructionData,
  type ParsedIndexedPostbyte,
  IndexedAction,
  parseIndexedPostbyte,
  INSTRUCTIONS,
  type AddressingMode,
} from "../util/instructions.js";
import { element } from "../../general/html.js";
import { truncate, signExtend, numberToIntN, intNToNumber } from "../../general/numbers.js";

// we assume this _read_ function reads big-endian, and reads 1 byte by default.
type ReadFunction = (address: number, bytes?: number) => Promise<number>;

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type InstructionUIConfig = {};

function validateMemoryUIConfig(config: Record<string, unknown>): InstructionUIConfig {
  return config as InstructionUIConfig;
}

type DisassIdxAddressingResult = {
  // The number of bytes read from the PC
  bytesReadOffPC: number;
  baseAddress: number;
  offset: number;
  effectiveAddress: number;
  address: number;
};
async function disassIdxAdressing(
  read: ReadFunction,
  parsedPostbyte: ParsedIndexedPostbyte,
  pc: number,
  registers: Registers,
): Promise<DisassIdxAddressingResult> {
  const { action, register, indirect, rest } = parsedPostbyte;
  let bytesReadOffPC = 0;

  const baseAddress: number = registers[register];
  let offset: number; // A signed 16-bit offset
  switch (action) {
    case IndexedAction.Offset0:
      offset = 0;
      break;
    case IndexedAction.Offset5:
      offset = signExtend(rest, 5, 16);
      break;
    case IndexedAction.Offset8:
    case IndexedAction.OffsetPC8:
      offset = signExtend(await read(pc, 1), 8, 16);
      bytesReadOffPC++;
      break;
    case IndexedAction.Offset16:
    case IndexedAction.OffsetPC16:
      offset = await read(pc, 2);
      bytesReadOffPC++;
      break;
    case IndexedAction.OffsetA:
      offset = registers.A;
      break;
    case IndexedAction.OffsetB:
      offset = registers.B;
      break;
    case IndexedAction.OffsetD:
      offset = registers.D;
      break;
    case IndexedAction.PostInc1:
      offset = 0;
      break;
    case IndexedAction.PostInc2:
      offset = 0;
      break;
    case IndexedAction.PreDec1:
      offset = numberToIntN(-1, 16);
      break;
    case IndexedAction.PreDec2:
      offset = numberToIntN(-2, 16);
      break;
  }

  // Overflow!
  const effectiveAddress = truncate(baseAddress + offset, 16);
  let address = effectiveAddress;

  if (indirect) {
    address = await read(effectiveAddress, 2);
  }

  return {
    bytesReadOffPC,
    baseAddress,
    offset,
    effectiveAddress,
    address,
  };
}

// type DisassAddressingResult =
//   | { mode: "immediate"; address: "pc"; value: number; size: number }
//   | { mode: "direct"; address: number; size: number }
//   | { mode: "indexed"; address: number; size: number }
//   | { mode: "extended"; address: number; size: number }
//   | { mode: "relative"; targetAddress: number; size: number };

// async function disassAdressing<T extends AddressableAddressingMode>(
//   read: ReadFunction,
//   address: number,
//   registers: Registers,
//   mode: T,
// ): Promise<T extends "immediate" ? "pc" : number> {
//   type ReturnType = T extends "immediate" ? "pc" : number;

//   switch (mode) {
//     case "immediate":
//       return "pc" as ReturnType;
//     case "direct": {
//       const low = await read(address, 1);

//       return ((registers.dp << 8) | low) as ReturnType;
//     }
//     case "indexed": {
//       const postbyte = await read(address, 1);
//       const parsedPostbyte = parseIndexedPostbyte(postbyte);
//       if (!parsedPostbyte) return null;

//       return (await indexedAddressing(cpu, postbyte)) as ReturnType;
//     }
//     case "extended": {
//       return (await read(address, 2)) as ReturnType;
//     }
//     case "relative": {
//       // Only used for branches
//       const offset = await read(registers.pc, 1);
//       registers.pc += 1;
//       return truncate(registers.pc + signExtend(offset, 8, 16), 16) as ReturnType;
//     }
//   }
//   throw new Error("[instruction-ui] Unknown addressing mode passed to addressing function");
// }

// biome-ignore format: this is easier to read if not biome-formatted
type DecompiledAddressingInfo<T extends AddressingMode> = 
  T extends "immediate" ? { mode: T } :
  T extends "direct" ? { mode: T, address: number, low: number } :
  T extends "indexed" ? { mode: "indexed"; address: number, postbyte: number; 
                          parsedPostbyte: ParsedIndexedPostbyte, result: DisassIdxAddressingResult } :
  T extends "extended" ? { mode: T, address: number } :
  T extends "relative" ? { mode: T, address: number, offset: number } :
  T extends "inherent" ? { mode: T } :
  never;

type DecompiledInstruction<T extends AddressingMode = AddressingMode> = {
  startAddress: number;
  opcode: number;
  instruction: InstructionData<T>;
  args: number[];
  size: number;
  registerSize: number;
  addressing: DecompiledAddressingInfo<T>;
};
async function decompileInstruction(
  read: ReadFunction,
  registers: Registers,
  startAddress: number,
): Promise<DecompiledInstruction | null> {
  const opcodeBytes = [];
  const args = [];
  let size = 0;
  let addressing: DecompiledAddressingInfo<AddressingMode> | undefined;

  // Fetch the opcode
  opcodeBytes.push(await read(startAddress + size++));
  if (opcodeBytes[0] === 0x10 || opcodeBytes[0] === 0x11) {
    opcodeBytes.push(await read(startAddress + size++));
  }
  const opcode = opcodeBytes.reduce((acc, byte) => (acc << 8) | byte, 0);

  // Find the instruction
  if (!INSTRUCTIONS[opcode]) return null;
  const instruction = INSTRUCTIONS[opcode];

  const registerSize = REGISTER_SIZE[instruction.register];

  // Perform addressing.
  let address: number | "pc";
  switch (instruction.mode) {
    case "immediate": {
      address = "pc";
      args.push(await read(startAddress + size, registerSize));
      size += registerSize;

      addressing = { mode: "immediate" };
      break;
    }
    case "direct": {
      const low = await read(startAddress + size++, 1);
      address = (registers.dp << 8) | low;
      args.push(address);

      addressing = { mode: "direct", address, low };
      break;
    }
    case "indexed": {
      const postbyte = await read(startAddress + size++, 1);
      args.push(postbyte);

      const parsedPostbyte = parseIndexedPostbyte(postbyte);
      if (!parsedPostbyte) return null;

      const idxResult = await disassIdxAdressing(
        read,
        parsedPostbyte,
        startAddress + size,
        registers,
      );
      size += idxResult.bytesReadOffPC;
      address = idxResult.address;

      addressing = { mode: "indexed", postbyte, parsedPostbyte, result: idxResult, address };
      break;
    }
    case "extended": {
      address = await read(startAddress + size, 2);
      size += 2;
      args.push(address);

      addressing = { mode: "extended", address };
      break;
    }
    case "relative": {
      const offset = await read(startAddress + size++, 1);
      address = truncate(startAddress + signExtend(offset, 8, 16), 16);
      args.push(address);

      addressing = { mode: "relative", offset, address };
      break;
    }
    case "inherent": {
      addressing = { mode: "inherent" };

      break;
    }
    default:
      throw new Error(`[InstructionUI] Unknown addressing mode ${instruction.mode}`);
  }

  return {
    startAddress,
    opcode,
    instruction,
    args,
    registerSize,
    size,
    addressing,
  };
}

function generateInstructionElement(
  decompiled: DecompiledInstruction,
  formatAddress: (data: number) => string,
  dataElement: HTMLDivElement,
  extraElement: HTMLDivElement,
): void {
  const { registerSize, args, addressing } = decompiled;
  const { mnemonic } = decompiled.instruction;
  const { mode } = addressing;

  const registerHexSize = registerSize * 2;

  let data = mnemonic;
  let extra = `${mode.slice(0, 3)}`;

  switch (mode) {
    case "immediate":
      data += ` #0x${args[0].toString(16).padStart(registerHexSize, "0")}`;
      break;
    case "direct":
      data += ` 0x${addressing.low}`;
      extra += ` <${formatAddress(addressing.address)}>`;
      break;
    case "indexed": {
      let idxStr = " ";

      const { parsedPostbyte } = addressing;
      // The offset.
      switch (parsedPostbyte.action) {
        case IndexedAction.Offset0:
          idxStr += "";
          break;
        case IndexedAction.Offset5:
        case IndexedAction.Offset8:
        case IndexedAction.Offset16:
        case IndexedAction.OffsetPC8:
        case IndexedAction.OffsetPC16:
          idxStr += "??";
          break;
        case IndexedAction.OffsetA:
          idxStr += "A";
          break;
        case IndexedAction.OffsetB:
          idxStr += "B";
          break;
        case IndexedAction.OffsetD:
          idxStr += "D";
          break;
      }

      idxStr += ",";

      // The register.
      if (parsedPostbyte.action === IndexedAction.PreDec1) idxStr += "-";
      else if (parsedPostbyte.action === IndexedAction.PreDec2) idxStr += "--";

      if (parsedPostbyte.register === "pc") idxStr += "PCR";
      else idxStr += parsedPostbyte.register;

      if (parsedPostbyte.action === IndexedAction.PostInc1) idxStr += "+";
      else if (parsedPostbyte.action === IndexedAction.PostInc2) idxStr += "++";

      if (parsedPostbyte.indirect) idxStr = `[${idxStr}]`;
      data += idxStr;
      break;
    }
    case "extended":
      data += ` <${formatAddress(addressing.address)}>`;
      break;
    case "relative": {
      // NOTE: Convert the relative address to a signed number for display.
      const offset = intNToNumber(addressing.offset, 8);
      data += ` pc${offset >= 0 ? "+" : ""}${offset}`;
      extra += ` <${formatAddress(addressing.address)}>`;
      break;
    }
  }

  dataElement.innerText = data;
  extraElement.innerText = extra;
}

class InstructionUI implements IModule {
  et: TypedEventTransceiver;
  id: string;

  config: InstructionUIConfig;

  registers?: Registers;

  panel?: HTMLElement;

  getEventDeclaration(): EventDeclaration {
    return {
      provided: ["ui:memory:read"],
      required: {
        "ui:memory:read:result": null,
        "gui:panel_created": this.onGuiPanelCreated,
        "cpu:registers_update": this.onRegistersUpdate,
        "signal:reset": this.clearPanel,
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

    // this.anchor = element("div", { properties: { className: "scroll-anchor" } });
    // this.panel.appendChild(this.anchor);
  };

  onRegistersUpdate = (registers: Registers): void => {
    if (!this.panel) return;

    const oldRegs = this.registers;
    this.registers = registers.copy();

    // If the PC hasn't changed, we don't need to update the panel.
    if (oldRegs !== undefined && oldRegs.pc === registers.pc) return;

    this.populatePanel();
  };

  clearPanel = (): void => {
    if (!this.panel) return;

    // Clear the panel.
    this.panel.innerHTML = "";
  };

  formatAddress(data: number): string {
    return data.toString(16).padStart(4, "0");
  }

  async populatePanel(): Promise<void> {
    if (!this.panel || !this.registers) return;

    const startAddress = this.registers.pc;
    let currentAddress = startAddress;

    const row = element("div", {
      properties: { className: "row" },
      children: [
        element("span", {
          properties: { className: "address", innerText: "0000" },
        }),
        element("span", { properties: { className: "data", innerText: "..." } }),
        element("span", { properties: { className: "extra", innerText: "" } }),
      ],
    });

    const decompiled = await decompileInstruction(this.read, this.registers, currentAddress);
    (row.children[0] as HTMLDivElement).innerText = this.formatAddress(currentAddress);
    if (decompiled != null) {
      generateInstructionElement(
        decompiled,
        this.formatAddress,
        row.children[1] as HTMLDivElement,
        row.children[2] as HTMLDivElement,
      );

      currentAddress += decompiled.size;
    } else {
      (row.children[1] as HTMLDivElement).innerText = "??";
    }

    // Auto scroll to bottom if already on bottom. I haven't been able to achieve
    // this with CSS, so I'm doing it here.
    const atBottom = this.panel.scrollHeight - this.panel.clientHeight <= this.panel.scrollTop + 1;
    this.panel.appendChild(row);
    if (atBottom) this.panel.scrollTop = this.panel.scrollHeight - this.panel.clientHeight;
  }
}

export default InstructionUI;

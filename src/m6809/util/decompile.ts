import { REGISTER_SIZE, type Registers } from "../util/cpu_parts.js";
import {
  type InstructionData,
  type ParsedIndexedPostbyte,
  IndexedAction,
  parseIndexedPostbyte,
  INSTRUCTIONS,
  type AddressingMode,
} from "../util/instructions.js";
import {
  truncate,
  signExtend,
  numberToIntN,
  intNToNumber,
  decompose,
} from "../../general/numbers.js";

// we assume this _read_ function reads big-endian, and reads 1 byte by default.
export type ReadFunction = (address: number, bytes?: number) => Promise<number>;

type DisassIdxAddressingResult = {
  // The number of bytes read from the PC
  bytesReadOffPC: number;
  baseAddress: number;
  offset: number;
  effectiveAddress: number;
  address: number;
};
export async function disassIdxAdressing(
  read: ReadFunction,
  parsedPostbyte: ParsedIndexedPostbyte,
  pc: number,
  registers: Registers,
): Promise<DisassIdxAddressingResult> {
  const { action, register, indirect, rest } = parsedPostbyte;
  let bytesReadOffPC = 0;

  let baseAddress: number = registers[register];
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
    case IndexedAction.ExtendedIndirect:
      baseAddress = await read(pc, 2);
      bytesReadOffPC += 2;
      offset = 0;
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
  T extends "immediate" ? { mode: T, value: number } :
  T extends "direct" ? { mode: T, address: number, low: number } :
  T extends "indexed" ? { mode: "indexed"; address: number, postbyte: number; 
                          parsedPostbyte: ParsedIndexedPostbyte, result: DisassIdxAddressingResult } :
  T extends "extended" ? { mode: T, address: number } :
  T extends "relative" ? { mode: T, address: number, offset: number } :
  T extends "inherent" ? { mode: T } :
  never;

export type DecompiledInstruction<T extends AddressingMode = AddressingMode> = {
  startAddress: number;

  // The values in memory that make up the instruction.
  bytes: number[];
  opcode: number;
  args: number[];

  // The values above but in a more readable format.
  instruction: InstructionData<T>;
  addressing: DecompiledAddressingInfo<T>;
  registerSize: number; // redundant
  size: number; // redundant

  failed: false;
};
export type FailedDecompilation = {
  startAddress: number;
  bytes: number[];
  opcode: number;
  failed: true;
  reason: "opcode" | "indexed_postbyte";
};
export function eqDecompilation(
  a: DecompiledInstruction | FailedDecompilation,
  b: DecompiledInstruction | FailedDecompilation,
): boolean {
  return (
    a.startAddress === b.startAddress &&
    a.failed === b.failed &&
    a.bytes.length === b.bytes.length &&
    a.bytes.every((byte, i) => byte === b.bytes[i])
  );
}

export async function decompileInstruction(
  read: ReadFunction,
  registers: Registers,
  startAddress: number,
): Promise<DecompiledInstruction | FailedDecompilation> {
  const opcodeBytes = [];
  const args = [];
  const bytes = [];

  let size = 0;
  let addressing: DecompiledAddressingInfo<AddressingMode> | undefined;

  // Fetch the opcode
  opcodeBytes.push(await read(startAddress + size++));
  if (opcodeBytes[0] === 0x10 || opcodeBytes[0] === 0x11) {
    opcodeBytes.push(await read(startAddress + size++));
  }
  const opcode = opcodeBytes.reduce((acc, byte) => (acc << 8) | byte, 0);
  bytes.push(...opcodeBytes);

  // Find the instruction
  if (!INSTRUCTIONS[opcode])
    return {
      startAddress,
      bytes,
      opcode,
      failed: true,
      reason: "opcode",
    };
  const instruction = INSTRUCTIONS[opcode];

  // Perform addressing.
  let address: number | "pc";
  // Some instructions don't use registers at all (CLR), so we use 0 as the register
  // size for those.
  const registerSize = instruction.register === undefined ? 0 : REGISTER_SIZE[instruction.register];

  switch (instruction.mode) {
    case "immediate": {
      if (registerSize === 0)
        throw new Error("[InstructionUI] Immediate mode with no register size");

      address = "pc";
      const value = await read(startAddress + size, registerSize);
      args.push(value);
      size += registerSize;

      addressing = { mode: "immediate", value };
      bytes.push(...decompose(value, registerSize));
      break;
    }
    case "direct": {
      const low = await read(startAddress + size++, 1);
      address = (registers.dp << 8) | low;
      args.push(address);

      addressing = { mode: "direct", address, low };
      bytes.push(low);
      break;
    }
    case "indexed": {
      const postbyte = await read(startAddress + size++, 1);
      args.push(postbyte);
      bytes.push(postbyte);

      const parsedPostbyte = parseIndexedPostbyte(postbyte);
      if (!parsedPostbyte)
        return {
          startAddress,
          bytes,
          opcode,
          failed: true,
          reason: "indexed_postbyte",
        };

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
      bytes.push(...decompose(address, 2));

      addressing = { mode: "extended", address };
      break;
    }
    case "relative": {
      const offsetBytes = instruction.extra.isLongBranch ? 2 : 1;

      const offset = await read(startAddress + size++, offsetBytes);
      address = truncate(startAddress + signExtend(offset, offsetBytes * 2, 16), 16);
      args.push(address);

      addressing = { mode: "relative", offset, address };
      bytes.push(...decompose(offset, offsetBytes));
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
    bytes: bytes,
    failed: false,
  };
}

export type InstructionRowData = {
  address: string;
  raw: string;
  data: string;
  extra: string;
  size: number;
  ok: true;
};
type FailedInstructionRowData = {
  address: string;
  raw: string;
  ok: false;
};
export type AllInstructionRowData = InstructionRowData | FailedInstructionRowData;
export function generateInstructionElement(
  row: AllInstructionRowData,
  addressElement: HTMLElement,
  rawElement: HTMLElement,
  dataElement: HTMLElement,
  extraElement: HTMLElement,
) {
  addressElement.innerText = row.address;
  rawElement.innerText = row.raw;
  dataElement.innerText = row.ok ? row.data : "???";
  extraElement.innerText = row.ok ? row.extra : "???";
}

export function generateRowData(
  decompiled: DecompiledInstruction | FailedDecompilation,
  formatAddress: (data: number) => string,
): AllInstructionRowData {
  const address = formatAddress(decompiled.startAddress);
  const raw = decompiled.bytes.map((byte) => byte.toString(16).padStart(2, "0")).join(" ");

  if (decompiled.failed) {
    return {
      address,
      raw,
      ok: false,
    };
  } else {
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

    return {
      address,
      raw,
      data,
      extra,
      size: decompiled.size,
      ok: true,
    };
  }
}

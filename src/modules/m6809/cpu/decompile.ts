import {
  decompose,
  hex,
  hexSign,
  intNToNumber,
  numberToIntN,
  signExtend,
  truncate,
} from "../../../utils/numbers.js";
import { REGISTER_SIZE, type Registers } from "./cpu_parts.js";
import {
  type AddressingMode,
  INSTRUCTIONS,
  IndexedAction,
  type InstructionData,
  type ParsedIndexedPostbyte,
  type Register,
  parseIndexedPostbyte,
} from "../cpu/instructions.js";
import { type AllRegisters, parseExgPostbyte } from "../cpu/instructions/loadstore.js";
import { parseStackPostbyte } from "../cpu/instructions/stack.js";

// we assume this _read_ function reads big-endian, and reads 1 byte by default.
export type ReadFunction = (address: number, bytes?: number) => Promise<number>;

export type Symbol = [string, number];

type IndexedDisassembledObj = {
  bytes: number[];
  // The number of bytes read from the PC
  bytesReadOffPC: number;

  // The offset is a signed 16-bit value, or a register name (if we don't have
  // information about the value of the registers).
  offset: number | AllRegisters;
  // Base address is the value of the register used as the base for the
  // indexed addressing (or the name of the register if we don't have info about
  // the value of the registers).
  baseAddress: number | Register;

  // The address before indirections (base + offset), calculated only if the
  // registers are known or the register is PC.
  effectiveAddress?: number;
  // The address after indirections (only if effectiveAddress is known).
  address?: number;
};
export async function disassembleIndexed(
  read: ReadFunction,
  parsedPostbyte: ParsedIndexedPostbyte,
  pc: number,
  registers?: Registers,
): Promise<IndexedDisassembledObj> {
  const { action, register, indirect, rest } = parsedPostbyte;
  let bytesReadOffPC = 0;
  const bytes = [];

  let baseAddress: number | Register;
  if (register === "pc") {
    // We always know the value of PC.
    baseAddress = pc;
  } else if (registers !== undefined) {
    // If we have the registers, we can use the value of the register.
    baseAddress = registers[register];
  } else {
    // If we don't have the registers, we just use the register name.
    baseAddress = register;
  }

  // A signed 16-bit offset or a register name (if we don't have the
  // register info).
  let offset: number | "A" | "B" | "D";
  switch (action) {
    case IndexedAction.Offset0:
      offset = 0;
      break;
    case IndexedAction.Offset5:
      offset = signExtend(rest, 5, 16);
      break;
    case IndexedAction.Offset8:
    case IndexedAction.OffsetPC8: {
      const byte = await read(pc, 1);
      bytes.push(byte);
      offset = signExtend(byte, 8, 16);
      bytesReadOffPC++;
      break;
    }
    case IndexedAction.Offset16:
    case IndexedAction.OffsetPC16: {
      offset = await read(pc, 2);
      bytes.push(...decompose(offset, 2));
      bytesReadOffPC += 2;
      break;
    }
    case IndexedAction.OffsetA:
      offset = registers ? registers.A : "A";
      break;
    case IndexedAction.OffsetB:
      offset = registers ? registers.B : "B";
      break;
    case IndexedAction.OffsetD:
      offset = registers ? registers.D : "D";
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
      bytes.push(...decompose(baseAddress, 2));
      bytesReadOffPC += 2;
      offset = 0;
      break;
  }

  // We can only calculate the effective address if we have a base address
  // and an offset (that is, if we have the registers or the register is PC,
  // which we always know).
  if (typeof baseAddress === "string" || typeof offset === "string") {
    // If we don't have the registers, we can't calculate the effective address.
    // We just return the base address and offset.
    return {
      bytes,
      bytesReadOffPC,
      baseAddress,
      offset,
    };
  }

  // Overflow the effective address if the offset is larger than 16 bits.
  let untruncEffectiveAddress = baseAddress + offset;
  if (register === "pc") {
    // If the register is PC, the offset is relative to the value of the PC
    // at the end of the instruction and all of its operands. So we add the
    // bytes we read off the PC to the efective address, so that it reflects the
    // value of the PC after the instruction is executed.
    untruncEffectiveAddress += bytesReadOffPC;
  }
  const effectiveAddress = truncate(untruncEffectiveAddress, 16);
  let address = effectiveAddress;

  if (indirect) {
    address = await read(effectiveAddress, 2);
  }

  return {
    bytes,
    bytesReadOffPC,
    baseAddress,
    offset,
    effectiveAddress,
    address,
  };
}

// biome-ignore format: this is easier to read if not biome-formatted
type DecompiledAddressingInfo<T extends AddressingMode> = 
  T extends "immediate" ? { mode: T, value: number } :
  T extends "direct" ? { mode: T, address?: number, low: number } :
  T extends "indexed" ? { mode: "indexed"; address?: number, postbyte: number; 
                          parsedPostbyte: ParsedIndexedPostbyte, result: IndexedDisassembledObj } :
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

  exgRegisters?: [AllRegisters | null, AllRegisters | null];
  registersAffectedStack?: AllRegisters[];

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

export async function disassembleInstruction(
  read: ReadFunction,
  startAddress: number,
  registers?: Registers,
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

  switch (instruction.mode) {
    case "immediate": {
      // The only instructions with immediate addressing and no register are
      // EXG and TFR. Those instructions have a postbyte that specifies the
      // registers (so the .extra.postbyte is set).
      // Other instructions that have immediate addressing and a postbyte are
      // PSH and PUL.
      const registerSize = instruction.extra.postbyte ? 1 : REGISTER_SIZE[instruction.register!];

      const address = "pc";
      const value = await read(startAddress + size, registerSize);
      args.push(value);
      size += registerSize;

      addressing = { mode: "immediate", value };
      bytes.push(...decompose(value, registerSize));
      break;
    }
    case "direct": {
      const low = await read(startAddress + size++, 1);
      let address: number | undefined;
      if (registers !== undefined) {
        address = (registers.dp << 8) | low;
        args.push(address);
      }

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

      const idxResult = await disassembleIndexed(
        read,
        parsedPostbyte,
        startAddress + size,
        registers,
      );
      bytes.push(...idxResult.bytes);
      args.push(...idxResult.bytes);
      size += idxResult.bytesReadOffPC;
      const address = idxResult.address;

      addressing = { mode: "indexed", postbyte, parsedPostbyte, result: idxResult, address };
      break;
    }
    case "extended": {
      const address = await read(startAddress + size, 2);
      size += 2;
      args.push(address);
      bytes.push(...decompose(address, 2));

      addressing = { mode: "extended", address };
      break;
    }
    case "relative": {
      const offsetBytes = instruction.extra.isLongBranch ? 2 : 1;

      const offset = await read(startAddress + size, offsetBytes);
      size += offsetBytes;
      const offsetSignExtended = signExtend(offset, offsetBytes * 8, 16);
      const address = truncate(startAddress + size + offsetSignExtended, 16);
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

  let exgRegisters: [AllRegisters | null, AllRegisters | null] | undefined;
  if (instruction.mnemonic === "exg" || instruction.mnemonic === "tfr") {
    exgRegisters = parseExgPostbyte((addressing as DecompiledAddressingInfo<"immediate">).value);
  }
  let registersAffectedStack: AllRegisters[] | undefined;
  if (instruction.mnemonic.startsWith("psh") || instruction.mnemonic.startsWith("pul")) {
    registersAffectedStack = parseStackPostbyte(
      (addressing as DecompiledAddressingInfo<"immediate">).value,
      instruction.register as "S" | "U",
      instruction.mnemonic.startsWith("pul") ? "pull" : "push",
    );
  }

  return {
    startAddress,
    opcode,
    instruction,
    args,
    addressing,
    exgRegisters,
    registersAffectedStack,
    bytes: bytes,
    failed: false,
  };
}

export type InstructionRowData = {
  address: string;
  title?: string;
  raw: string;
  mnemonic: string;
  args: string;
  extra: string;
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
  mnemonicElement: HTMLElement,
  argsElement: HTMLElement,
  extraElement: HTMLElement,
) {
  addressElement.innerText = row.address;
  rawElement.innerText = row.raw;
  mnemonicElement.innerText = row.ok ? row.mnemonic : "???";
  argsElement.innerText = row.ok ? row.args : "???";
  extraElement.innerText = row.ok ? row.extra : "???";
  if (row.ok && row.title) addressElement.title = row.title;
}

/**
 * Given a sorted list of symbols, return the symbol+offset for the given
 * address.  Doesn't give negative offsets.
 * @param address The address to get the symbol for.
 * @param symbols The list of symbols to search.
 * @returns
 */
export function getSymbolicAddress(
  symbols: Symbol[],
  address: number,
  maxOffset: number,
): [string, number] | [undefined, undefined] {
  // We find the symbol that is closest to the address, but not greater than it.

  for (let i = symbols.length - 1; i >= 0; i--) {
    const [symbol, symbolAddress] = symbols[i];
    if (symbolAddress <= address) {
      const offset = address - symbolAddress;
      if (offset > maxOffset)
        // If the offset is greater than the maximum offset, we don't return it.
        continue;
      return [symbol, offset];
    }
  }

  // If we didn't find a symbol, return undefined, undefined.
  return [undefined, undefined];
}

export function generateRowData(
  decompiled: DecompiledInstruction | FailedDecompilation,
  formatAddress: (address: number, addressLocation: "address" | "extra") => string,
  formatOffset: (offset: number, address: number, type: "relative" | "indexed") => string = (
    offset,
  ) => hexSign(offset, 0),
  generateTitle: (address: number) => string | undefined = () => undefined,
): AllInstructionRowData {
  const startAddressField = formatAddress(decompiled.startAddress, "address");
  const rawBytesField = decompiled.bytes.map((byte) => hex(byte)).join(" ");

  if (decompiled.failed)
    return {
      address: startAddressField,
      raw: rawBytesField,
      ok: false,
    };

  const { args, addressing } = decompiled;
  const { mnemonic } = decompiled.instruction;
  const { mode } = addressing;

  let argsField = "";
  let extraField = "";

  switch (mode) {
    case "immediate": {
      if (decompiled.instruction.extra.postbyte) {
        // If the instruction has a postbyte, we don't want to display the value
        // as a number, but rather as the registers that are affected by the
        // operation.
        if (mnemonic.startsWith("psh") || mnemonic.startsWith("pul")) {
          // PSH or PUL
          argsField += ` ${decompiled.registersAffectedStack!.join(",")}`;
        } else {
          // EXG or TFR
          const [src, dst] = decompiled.exgRegisters!;
          argsField += ` ${src},${dst}`;
        }
      } else {
        const registerSize = REGISTER_SIZE[decompiled.instruction.register!];
        argsField += ` #0x${hex(args[0], registerSize)}`;
      }
      break;
    }
    case "direct":
      if (addressing.address !== undefined) {
        argsField += ` ${formatAddress(addressing.address, "extra")}`;
      } else {
        argsField += ` <${hex(addressing.low)}`;
      }
      break;
    case "indexed": {
      let idxStr = "";

      const { parsedPostbyte, result } = addressing;
      // The offset.
      switch (parsedPostbyte.action) {
        case IndexedAction.Offset0:
          idxStr += "";
          break;
        case IndexedAction.Offset5:
        case IndexedAction.Offset8:
        case IndexedAction.Offset16:
        case IndexedAction.OffsetPC8:
        case IndexedAction.OffsetPC16: {
          // if (decompiled.startAddress === 0x18d) debugger;
          if (typeof result.offset === "string" || result.effectiveAddress === undefined) {
            // If the offset is a register name, we just display the register name.
            idxStr += result.offset;
          } else {
            const offset = intNToNumber(result.offset, 16);
            const offsetStr = formatOffset(offset, result.effectiveAddress, "indexed");
            idxStr += offsetStr;
            // extraField += ` <${formatAddress(result.effectiveAddress, "extra")}>`;
          }
          break;
        }
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

      if (parsedPostbyte.register === "pc") idxStr += "PC";
      else idxStr += parsedPostbyte.register;

      if (parsedPostbyte.action === IndexedAction.PostInc1) idxStr += "+";
      else if (parsedPostbyte.action === IndexedAction.PostInc2) idxStr += "++";

      if (parsedPostbyte.indirect) idxStr = `[${idxStr}]`;
      argsField += ` ${idxStr}`;
      break;
    }
    case "extended":
      argsField += ` <${formatAddress(addressing.address, "extra")}>`;
      break;
    case "relative": {
      // NOTE: Convert the relative address to a signed number for display.
      const offset = intNToNumber(addressing.offset, 8);
      argsField += ` ${formatOffset(offset, addressing.address, "relative")}`;
      // If the instruction is a branch, we can display the address it branches to.
      // argsField += ` pc${offset >= 0 ? "+" : ""}${offset}`;
      // extraField += ` <${formatAddress(addressing.address, "extra")}>`;
      break;
    }
  }

  return {
    address: startAddressField,
    raw: rawBytesField,
    mnemonic,
    args: argsField,
    extra: extraField,
    title: generateTitle(decompiled.startAddress),
    ok: true,
  };
}

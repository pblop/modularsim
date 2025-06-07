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
  parseIndexedPostbyte,
} from "../cpu/instructions.js";
import { type AllRegisters, parseExgPostbyte } from "../cpu/instructions/loadstore.js";
import { parseStackPostbyte } from "../cpu/instructions/stack.js";

// we assume this _read_ function reads big-endian, and reads 1 byte by default.
export type ReadFunction = (address: number, bytes?: number) => Promise<number>;

export type Symbol = [string, number];

type DisassIdxAddressingResult = {
  bytes: number[];
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
  const bytes = [];

  let baseAddress: number = register === "pc" ? pc : registers[register];
  let offset: number; // A signed 16-bit offset
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
      bytes.push(...decompose(baseAddress, 2));
      bytesReadOffPC += 2;
      offset = 0;
      break;
  }

  // Overflow!
  let untruncEffectiveAddress = baseAddress + offset;
  if (register === "pc")
    // If the register is PC, the offset is relative to the end of the
    // instruction.
    untruncEffectiveAddress += bytesReadOffPC;
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

  switch (instruction.mode) {
    case "immediate": {
      // The only instructions with immediate addressing and no register are
      // EXG and TFR. Those instructions have a postbyte that specifies the
      // registers (so the .extra.postbyte is set).
      // Other instructions that have immediate addressing and a postbyte are
      // PSH and PUL.
      const registerSize = instruction.extra.postbyte ? 1 : REGISTER_SIZE[instruction.register!];

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
      bytes.push(...idxResult.bytes);
      args.push(...idxResult.bytes);
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
  data: string;
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
  dataElement: HTMLElement,
  extraElement: HTMLElement,
) {
  addressElement.innerText = row.address;
  rawElement.innerText = row.raw;
  dataElement.innerText = row.ok ? row.data : "???";
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
        return [undefined, undefined];
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

  let dataField = mnemonic;
  let extraField = `${mode.slice(0, 3)}`;

  switch (mode) {
    case "immediate": {
      if (decompiled.instruction.extra.postbyte) {
        // If the instruction has a postbyte, we don't want to display the value
        // as a number, but rather as the registers that are affected by the
        // operation.
        if (mnemonic.startsWith("psh") || mnemonic.startsWith("pul")) {
          // PSH or PUL
          dataField += ` ${decompiled.registersAffectedStack!.join(",")}`;
        } else {
          // EXG or TFR
          const [src, dst] = decompiled.exgRegisters!;
          dataField += ` ${src},${dst}`;
        }
      } else {
        const registerSize = REGISTER_SIZE[decompiled.instruction.register!];
        dataField += ` #0x${hex(args[0], registerSize)}`;
      }
      break;
    }
    case "direct":
      dataField += ` <${hex(addressing.low)}`;
      extraField += ` <${formatAddress(addressing.address, "extra")}>`;
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
          const offset = intNToNumber(result.offset, 16);
          const offsetStr = formatOffset(offset, result.effectiveAddress, "indexed");
          idxStr += offsetStr;
          extraField += ` <${formatAddress(result.effectiveAddress, "extra")}>`;
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
      dataField += ` ${idxStr}`;
      break;
    }
    case "extended":
      dataField += ` <${formatAddress(addressing.address, "extra")}>`;
      break;
    case "relative": {
      // NOTE: Convert the relative address to a signed number for display.
      const offset = intNToNumber(addressing.offset, 8);
      dataField += ` ${formatOffset(offset, decompiled.startAddress, "relative")}`;
      // dataField += ` pc${offset >= 0 ? "+" : ""}${offset}`;
      extraField += ` <${formatAddress(addressing.address, "extra")}>`;
      break;
    }
  }

  return {
    address: startAddressField,
    raw: rawBytesField,
    data: dataField,
    extra: extraField,
    title: generateTitle(decompiled.startAddress),
    ok: true,
  };
}

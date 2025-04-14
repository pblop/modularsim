import { truncate } from "../../../../utils/numbers.js";
import type { CycleEndFn, CycleStartFn } from "../state_machine.js";

const start: CycleStartFn<"customfn"> = ({ registers, et, cpu }, { ctx }) => {
  et.emit("cpu:function", registers.pc, registers.copy());
  cpu.receivedFnRegisters = undefined;

  return null;
};
const end: CycleEndFn<"customfn"> = ({ cpu }, { ctx }) => {
  // If the CPU received a result, it should be stored in newRegisters, we then
  // save it to the CPU registers, and conclude the function.
  if (cpu.receivedFnRegisters) {
    if (cpu.registers.pc === cpu.receivedFnRegisters.pc)
      console.warn(
        `[${cpu.id}] Custom function returned with the same PC, it will be called again next cycle!`,
      );
    cpu.registers = cpu.receivedFnRegisters;
    return "fetch";
  }

  return null;
};

export default { start, end };

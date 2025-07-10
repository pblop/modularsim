import As6809, { type MainModule as As6809MainModule } from "./as6809.js";
import Aslink, { type MainModule as AslinkMainModule } from "./aslink.js";

const AsxxxxErrorTypes = [
  ".",
  "a",
  "b",
  "d",
  "e",
  "i",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "u",
  "z",
] as const;
type AsxxxxErrorType = (typeof AsxxxxErrorTypes)[number];
type AsxxxxError = {
  line: number;
  type: AsxxxxErrorType;
  message: string;
};

type AssemblerLinkerError = {
  from: "assemble" | "link";
  msg: string;
  error: Error;
  stderr: string;
  stdout: string;
} & {
  from: "assemble";
  errors: AsxxxxError[];
};

const errorRegex = /\?ASxxxx-Error-<(.)> in line (\d+) of (.+)(?:\n\s+<(.)> (.+))*/gm;

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class AssemblerLinker {
  static textToUint8Array(text: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(text);
  }
  static textToBlob(text: string): Blob {
    return new Blob([text], { type: "text/plain" });
  }
  static uint8ArrayToText(array: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(array);
  }

  public static assemble(
    input: Uint8Array,
    options = ["-a"],
  ): Promise<[Uint8Array, AsxxxxError[]]> {
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      As6809({
        print: (message: string) => {
          stdout += `${message}\n`;
        },
        printErr: (message: string) => {
          stderr += `${message}\n`;
        },
      })
        .then((instance) => {
          instance.FS.writeFile("input.asm", input);
          const result = instance.callMain([...options, "-o", "output.rel", "input.asm"]);
          const errors = AssemblerLinker.parseAssemblyErrors(stderr);

          if (result !== 0) {
            reject({
              from: "assemble",
              msg: `non-zero exit code ${result}`,
              error: new Error(`Linking failed with exit code ${result}`),
              stderr,
              stdout,
              errors,
            });
            return;
          }

          const output = instance.FS.readFile("output.rel");
          resolve([output, errors]);
        })
        .catch((error) => {
          reject({ from: "assemble", msg: "wasm error", error, stderr, stdout });
        });
    });
  }

  public static parseAssemblyErrors(stderr: string): AsxxxxError[] {
    const errors: AsxxxxError[] = [];

    let m: RegExpExecArray | null;

    // Biome doesn't let me do this, and I don't want to disable the rule,
    // but it's waaaay cleaner to assign and check in the loop condition,
    // instead of a do-while loop... right?
    // biome-ignore lint/suspicious/noAssignInExpressions: <above>
    while ((m = errorRegex.exec(stderr)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === errorRegex.lastIndex) {
        errorRegex.lastIndex++;
      }

      if (!(AsxxxxErrorTypes as readonly string[]).includes(m[1])) {
        console.warn(`ASxxxx-Error type "${m[1]}" is not in the official list ${AsxxxxErrorTypes}`);
      }

      // Following this regex, message lines are captured as odd numbered groups after the 3rd one.
      // 0th capture group: the whole error string.
      // 1st capture group: the error type.
      // 2nd              : the line in which the error ocurrs.
      // 3rd              : the file in which the error ocurrs.
      // 4th              : the error type, again. Just in case. It should be the same as the first one.
      // 5th              : the first part of the error message.
      // If the error string is very long:
      // 6th              : the error type, again. Should be the same as the first and second ones.
      // 7th              : the second part of the error message.
      // 8th              : error type
      // 9th              : third part of the error message
      // ...

      const _type = m[1] as AsxxxxErrorType;
      const line = Number(m[2]);
      const file = m[3];
      let message = "";
      for (let i = 5; i < m.length; i += 2) {
        message += m[i];
      }

      errors.push({
        type: _type,
        line,
        message,
      });
    }

    return errors;
  }

  public static link(rel: Uint8Array, options = []): Promise<[Uint8Array, Uint8Array]> {
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      Aslink({
        print: (message: string) => {
          stdout += `${message}\n`;
        },
        printErr: (message: string) => {
          stderr += `${message}\n`;
        },
      })
        .then((instance) => {
          instance.FS.writeFile("input.rel", rel);
          const result = instance.callMain([...options, "-s", "-j", "input.rel"]);

          if (result !== 0) {
            reject({
              from: "link",
              msg: `non-zero exit code ${result}`,
              error: new Error(`Linking failed with exit code ${result}`),
              stderr,
              stdout,
            });
            return;
          }

          if (!instance.FS.analyzePath("input.s19", false).exists) {
            reject({
              from: "link",
              msg: "s19 not found",
              error: new Error("Linking did not produce 'input.s19' file"),
              stderr,
              stdout,
            });
            return;
          }
          if (!instance.FS.analyzePath("input.noi", false).exists) {
            reject({
              from: "link",
              msg: "noi not found",
              error: new Error("Linking did not produce 'input.noi' file"),
              stderr,
              stdout,
            });
            return;
          }
          const s19 = instance.FS.readFile("input.s19");
          const noi = instance.FS.readFile("input.noi");
          resolve([s19, noi]);
        })
        .catch((error) => {
          reject({ from: "link", msg: "wasm failed", error, stderr, stdout });
        });
    });
  }

  // public linkAndAssemble(): Promise<void> {}
}

export { AssemblerLinker, type AssemblerLinkerError };

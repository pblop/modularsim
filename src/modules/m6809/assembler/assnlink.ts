import As6809, { type MainModule as As6809MainModule } from "./as6809.js";
import Aslink, { type MainModule as AslinkMainModule } from "./aslink.js";

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

  public static assemble(input: Uint8Array, options = ["-a"]): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      As6809({
        print: (message: string) => {
          stdout += `${message}\n`;
        },
        error: (message: string) => {
          stderr += `${message}\n`;
        },
      })
        .then((instance) => {
          instance.FS.writeFile("input.asm", input);
          const result = instance.callMain([...options, "-o", "output.rel", "input.asm"]);

          if (result !== 0) {
            reject({ error: new Error(`Linking failed with exit code ${result}`), stderr, stdout });
            return;
          }

          const output = instance.FS.readFile("output.rel");
          resolve(output);
        })
        .catch((error) => {
          reject({ error, stderr, stdout });
        });
    });
  }

  public static link(rel: Uint8Array, options = []): Promise<[Uint8Array, Uint8Array]> {
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      Aslink({
        print: (message: string) => {
          stdout += `${message}\n`;
        },
        error: (message: string) => {
          stderr += `${message}\n`;
        },
      })
        .then((instance) => {
          instance.FS.writeFile("input.rel", rel);
          const result = instance.callMain([...options, "-s", "-j", "input.rel"]);

          if (result !== 0) {
            reject({
              msg: `non-zero exit code ${result}`,
              error: new Error(`Linking failed with exit code ${result}`),
              stderr,
              stdout,
            });
            return;
          }

          console.log(instance.FS.readdir("/"));
          if (!instance.FS.analyzePath("input.s19", false).exists) {
            reject({
              msg: "s19 not found",
              error: new Error("Linking did not produce 'input.s19' file"),
              stderr,
              stdout,
            });
            return;
          }
          if (!instance.FS.analyzePath("input.noi", false).exists) {
            reject({
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
          reject({ msg: "wasm failed", error, stderr, stdout });
        });
    });
  }

  // public linkAndAssemble(): Promise<void> {}
}

export default AssemblerLinker;

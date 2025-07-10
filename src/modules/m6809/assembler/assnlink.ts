import As6809, { type MainModule as As6809MainModule } from "./as6809.js";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class AssemblerLinker {
  static textToUint8Array(text: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(text);
  }
  static textToBlob(text: string): Blob {
    return new Blob([text], { type: "text/plain" });
  }

  public static assemble(input: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      As6809({
        print: (message: string) => {
          stdout += message;
        },
        error: (message: string) => {
          stderr += message;
        },
      })
        .then((instance) => {
          instance.FS.writeFile("input.asm", input);
          const result = instance.callMain(["-o", "output.rel", "input.asm"]);

          if (result !== 0) {
            reject(new Error(`Linking failed with exit code ${result}`));
            return;
          }

          const output = instance.FS.readFile("output.rel");
          resolve(output);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // public linkAndAssemble(): Promise<void> {}
}

export default AssemblerLinker;

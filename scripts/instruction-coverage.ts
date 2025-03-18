import { INSTRUCTIONS as IMPLEMENTED } from "../src/m6809/util/instructions";

function perc(n: number, total: number): string {
  return ((n / total) * 100).toFixed(2);
}
function perc_colour(n: number): string {
  if (n < 20) return "red";
  if (n < 40) return "orange";
  if (n < 60) return "yellow";
  if (n < 80) return "yellowgreen";

  return "brightgreen";
}
function gist_file(name: string, content: object): object {
  return {
    [name]: {
      content: JSON.stringify(content),
    },
  };
}

// biome-ignore format: please don't split this 😭
const instructions = [
  ['ABX'], ['ADCA', 'ADCB'], ['ADDA', 'ADDB', 'ADDD'],
  ['ANDA', 'ANDB', 'ANDCC'], ['ASR', 'ASRA', 'ASRB'], ['BEQ', 'LBEQ'],
  ['BGE', 'LBGE'], ['BGT', 'LBGT'], ['BHI', 'LBHI'], ['BCC', 'LBCC'],
  ['BITA', 'BITB'], ['BLE', 'LBLE'], ['BLO', 'LBCS'], ['BLS', 'LBLS'],
  ['BLT', 'LBLT'], ['BMI', 'LBMI'], ['BNE', 'LBNE'], ['BPL', 'LBPL'],
  ['BRA', 'LBRA'], ['BRN', 'LBRN'], ['BSR', 'LBSR'], ['BVC', 'LBVC'],
  ['BVS', 'LBVS'], ['CLR', 'CLRA', 'CLRB'],
  ['CMPA', 'CMPB', 'CMPD', 'CMPS', 'CMPU', 'CMPX', 'CMPY'],
  ['COM', 'COMA', 'COMB'], ['CWAI'], ['DAA'], ['DEC', 'DECA', 'DECB'],
  ['EORA', 'EORB'], ['EXG'], ['INC', 'INCA', 'INCB'], ['JMP'], ['JSR'],
  ['LDA', 'LDB', 'LDD', 'LDS', 'LDU', 'LDX', 'LDY'],
  ['LEAS', 'LEAU', 'LEAX', 'LEAY'], ['LSL', 'LSLA', 'LSLB'],
  ['LSR', 'LSRA', 'LSRB'], ['MUL'], ['NEG', 'NEGA', 'NEGB'], ['NOP'],
  ['ORA', 'ORB', 'ORCC'], ['PSHS', 'PSHU'], ['PULS', 'PULU'], ['RESET'],
  ['ROL', 'ROLA', 'ROLB'], ['ROR', 'RORA', 'RORB'], ['RTI'], ['RTS'],
  ['SBCA', 'SBCB'], ['SEX'], ['STA', 'STB', 'STD', 'STS', 'STU', 'STX', 'STY'],
  ['SUBA', 'SUBB', 'SUBD'], ['SWI', 'SWI2', 'SWI3'], ['SYNC'], ['TFR'],
  ['TST', 'TSTA', 'TSTB']
].map(x => x.map(m => m.toLowerCase()));

let implemented_mnemonics = Object.values(IMPLEMENTED).map((x) => x.mnemonic.toLowerCase());
// There are duplicated entries (multiple addressing modes).
implemented_mnemonics = [...new Set(implemented_mnemonics)];

// Add aliases
function add_alias(alias: string, mnemonic: string) {
  if (implemented_mnemonics.includes(mnemonic)) implemented_mnemonics.push(alias);
  if (implemented_mnemonics.includes(alias)) implemented_mnemonics.push(mnemonic);
}
add_alias("bcc", "bhs");
add_alias("bcs", "blo");
add_alias("lbcc", "lbhs");
add_alias("lbcs", "lblo");

// For all in `instructions`, check if they are implemented.
let fully_implemented = 0;
let partially_implemented = 0;

const total = instructions.length;
for (const mnemonics of instructions) {
  const all = mnemonics.every((mnemonic) => implemented_mnemonics.includes(mnemonic));
  if (all) {
    fully_implemented++;
    continue;
  }

  const some = mnemonics.some((mnemonic) => implemented_mnemonics.includes(mnemonic));
  const missing = mnemonics.filter((mnemonic) => !implemented_mnemonics.includes(mnemonic));
  if (some) {
    if (process.stdout.isTTY)
      console.error(`Partially implemented: ${mnemonics} (missing: ${missing})`);
    partially_implemented++;
  }
}

const fully_perc = perc(fully_implemented, total);
const partially_perc = perc(partially_implemented, total);
const atleast_partially_perc = perc(fully_implemented + partially_implemented, total);
const mnemonic_perc = perc(implemented_mnemonics.length, instructions.flat().length);
if (process.stdout.isTTY) {
  console.log(`Fully implemented: ${fully_implemented}/${total} (${fully_perc}%)`);
  console.log(`Partially implemented: ${partially_implemented}/${total} (${partially_perc}%)`);
  console.log(
    `At least partially implemented: ${fully_implemented + partially_implemented}/${total} (${atleast_partially_perc}%)`,
  );
  console.log(
    `Implemented mnemonics: ${implemented_mnemonics.length}/${instructions.flat().length} (${mnemonic_perc}%)`,
  );
} else {
  console.log(
    JSON.stringify({
      ...gist_file("implemented.json", {
        schemaVersion: 1,
        label: "Complete Groups",
        message: `${fully_implemented}/${total} (${fully_perc}%)`,
        color: perc_colour(Number(fully_perc)),
      }),
      ...gist_file("partial.json", {
        schemaVersion: 1,
        label: "Partial Groups",
        message: `${fully_implemented + partially_implemented}/${total} (${atleast_partially_perc}%)`,
        color: perc_colour(Number(atleast_partially_perc)),
      }),
      ...gist_file("mnemonics.json", {
        schemaVersion: 1,
        label: "Mnemonics",
        message: `${implemented_mnemonics.length}/${instructions.flat().length} (${mnemonic_perc}%)`,
        color: perc_colour(Number(mnemonic_perc)),
      }),
    }),
  );
}

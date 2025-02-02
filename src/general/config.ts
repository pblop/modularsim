/**
 * Returns true if the given value is a number, or a string that can be parsed as a number (in decimal,
 * hexadecimal, octal or binary).
 * The format for hexadecimal is 0x, for octal is 0o, and for binary is 0b.
 * Hex, octal and binary numbers cannot be negative.
 */
export function isNumber(val: unknown): boolean {
  const type = typeof val;
  if (type === "number") return true;

  if (type !== "string") return false;
  return /^0[o|O][0-7]+$|^0[b|B][01]+$|^0[x|X][0-9a-fA-F]+$|^-?\d+$/.test(val as string); // by now, it must be a string
}
/**
 * Parses a string as a number
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#literals).
 * The format for hexadecimal is 0x, for octal is 0o, and for binary is 0b.
 */
export function parseNumber(val: string): number {
  return Number(val);
}

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

// TODO: Parse arrays, and nested objects
export type VerificationType = "number" | "string";
export type VerificationProperty = {
  type: VerificationType;
  required?: boolean;
  default?: unknown;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: unknown[];
};
export type VerificationSchema = {
  [key: string]: VerificationProperty;
};
export function verify<T>(
  obj: Record<string, unknown>,
  schema: VerificationSchema,
  prepend = "",
): T {
  for (const [key, value] of Object.entries(schema)) {
    // Existence checks
    if (value.required && obj[key] === undefined)
      throw new Error(`${prepend} field "${key}" is required`);
    if (value.default !== undefined && obj[key] === undefined) obj[key] = value.default;
    if (obj[key] === undefined) continue;

    // Type checks
    if (value.type === "number") {
      if (!isNumber(obj[key]))
        throw new Error(
          `${prepend} field "${key}" must be a number (or a string representation thereof)`,
        );
      if (typeof obj[key] === "string") obj[key] = parseNumber(obj[key] as string);
    }
    if (value.type === "string" && typeof obj[key] !== "string") {
      throw new Error(`${prepend} field "${key}" must be a string`);
    }

    // Value checks
    if (
      value.min !== undefined &&
      typeof obj[key] === "number" &&
      (obj[key] as number) < value.min
    ) {
      throw new Error(`${prepend} field "${key}" must be greater than or equal to ${value.min}`);
    }
    if (
      value.max !== undefined &&
      typeof obj[key] === "number" &&
      (obj[key] as number) > value.max
    ) {
      throw new Error(`${prepend} field "${key}" must be less than or equal to ${value.max}`);
    }
    if (
      value.pattern !== undefined &&
      typeof obj[key] === "string" &&
      !value.pattern.test(obj[key] as string)
    ) {
      throw new Error(`${prepend} field "${key}" must match the pattern ${value.pattern}`);
    }
    if (value.enum !== undefined && !value.enum.includes(obj[key])) {
      throw new Error(`${prepend} field "${key}" must be one of ${value.enum}`);
    }
  }

  return obj as T;
}

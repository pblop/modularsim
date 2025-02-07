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

export function checkProperties(obj: { [key: string]: unknown }, properties: string[]): void {
  for (const prop of properties) {
    // Check if the property exists and is not null or empty
    if (!(prop in obj && obj[prop] != null && obj[prop] !== "")) {
      throw new Error(`Property ${prop} not found`);
    }
  }
}

export type SchemaType = "number" | "string" | "array" | "object";
export type PrimitiveSchema = {
  type: "number" | "string";
  required?: boolean;
  default?: unknown;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: unknown[];
};
/**
 * Only supports array of same type
 */
export type ArraySchema = {
  type: "array";
  required?: boolean;
  default?: unknown[];
  schema: VerificationSchema;
};
export type ObjectSchema = {
  type: "object";
  required?: boolean;
  default?: Record<string, unknown>;
  properties: VerificationProperties;
};
type VerificationSchema = PrimitiveSchema | ArraySchema | ObjectSchema;

export type VerificationProperties = {
  [key: string]: VerificationSchema;
};
/**
 * Verify that the given object has the expected properties and types, throwing
 * an error if it doesn't.
 * This function modifies the input object (pass by reference), and also
 * returns the modified object.
 * Default values are _not_ checked against the schema.
 */
export function verify<T>(
  obj: Record<string, unknown> | undefined,
  props: VerificationProperties,
  prepend = "validation error:",
): T {
  if (obj === undefined) throw new Error(`${prepend} main object is undefined`);
  return verifyObject(obj, prepend, { type: "object", required: true, properties: props }) as T;
}

function verifyProperty(
  inValue: string | number,
  fieldString: string,
  schema: PrimitiveSchema,
): string | number {
  let value = inValue;
  // Type checks
  if (schema.type === "number") {
    if (!isNumber(value))
      throw new Error(`${fieldString} must be a number (or a string representation thereof)`);
    if (typeof value === "string") value = parseNumber(value as string);
  }
  if (schema.type === "string" && typeof value !== "string") {
    throw new Error(`${fieldString} must be a string`);
  }

  // Value checks
  if (schema.min !== undefined && typeof value === "number" && (value as number) < schema.min) {
    throw new Error(`${fieldString} must be greater than or equal to ${schema.min}`);
  }
  if (schema.max !== undefined && typeof value === "number" && (value as number) > schema.max) {
    throw new Error(`${fieldString} must be less than or equal to ${schema.max}`);
  }
  if (
    schema.pattern !== undefined &&
    typeof value === "string" &&
    !schema.pattern.test(value as string)
  ) {
    throw new Error(`${fieldString} must match the pattern ${schema.pattern}`);
  }
  if (schema.enum !== undefined && !schema.enum.includes(value)) {
    throw new Error(`${fieldString} must be one of ${schema.enum}`);
  }

  return value;
}
/**
 * NOTE: This function modifies the input object (pass by reference), and also
 * returns the modified object.
 */
function verifyArray(value: unknown[], fieldString: string, schema: ArraySchema): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${fieldString} must be an array`);

  for (let i = 0; i < value.length; i++) {
    if (schema.schema.type === "number" || schema.schema.type === "string") {
      value[i] = verifyProperty(value[i] as string | number, `${fieldString}[${i}]`, schema.schema);
    } else if (schema.schema.type === "object") {
      value[i] = verify(
        value[i] as Record<string, unknown>,
        schema.schema.properties,
        `${fieldString}[${i}]`,
      );
    }
  }

  return value;
}

/**
 * NOTE: This function modifies the input object (pass by reference), and also
 * returns the modified object.
 */
function verifyObject(
  obj: Record<string, unknown>,
  fieldString: string,
  objectSchema: ObjectSchema,
) {
  if (typeof obj !== "object" || Array.isArray(obj))
    throw new Error(`${fieldString} must be an object`);

  for (const [key, schema] of Object.entries(objectSchema.properties)) {
    // Existence checks
    if (schema.required && obj[key] === undefined)
      throw new Error(`${fieldString} field "${key}" is required`);
    if (schema.default !== undefined && obj[key] === undefined) {
      obj[key] = schema.default;
      return obj;
    }
    if (obj[key] === undefined) continue;

    if (schema.type === "number" || schema.type === "string") {
      obj[key] = verifyProperty(obj[key] as string | number, `${fieldString} field ${key}`, schema);
    } else if (schema.type === "array") {
      obj[key] = verifyArray(obj[key] as unknown[], `${fieldString} field ${key}`, schema);
    } else if (schema.type === "object") {
      obj[key] = verifyObject(
        obj[key] as Record<string, unknown>,
        `${fieldString} field ${key}`,
        schema,
      );
    }
  }

  return obj;
}

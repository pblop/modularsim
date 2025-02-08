/**
 * Generate a typed string object (TypeScript makes sure that all the strings are
 * present for all the languages).
 * @param strings An object, that, for each key (language), contains an object with
 * all the named strings.
 * @returns The same object, but the TypeScript compiler will know some more
 * information about it.
 */
export function createLanguageStrings<T>(
  strings: Record<string, Required<T>>,
): Record<string, Required<T>> {
  return strings;
}

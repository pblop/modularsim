export function checkProperties(obj: { [key: string]: unknown }, properties: string[]): void {
  for (const prop of properties) {
    // Check if the property exists and is not null or empty
    if (!(prop in obj && obj[prop] != null && obj[prop] !== "")) {
      throw new Error(`Property ${prop} not found`);
    }
  }
}

/**
 * Set the style properties of an element to the ones given in the style object,
 * removing any existing styles that are not in the style object.
 * @param element The element to set the style of.
 * @param style The style object to set.
 * @returns void
 */
export function setStyle(element: HTMLElement, style: Record<string, string>): void {
  element.style.cssText = "";
  for (const [key, value] of Object.entries(style)) {
    const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
    element.style.setProperty(kebabKey, value);
  }
}

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    properties?: Partial<HTMLElementTagNameMap[K]>;
    attributes?: Record<string, string>;
    // NOTE: This could be style?: Partial<CSSStyleDeclaration>, but then I would
    // have to convert camelCase names to kebab-case.
    style?: Record<string, string>;
    children?: HTMLElement[];
  },
): HTMLElementTagNameMap[K] {
  const { properties = {}, style = {}, attributes = {}, children = [] } = options;

  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(properties)) {
    (el as unknown as Record<string, unknown>)[key] = value;
  }

  if (Object.keys(style).length > 0) setStyle(el, style);

  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value);
  }
  for (const child of children) {
    el.appendChild(child);
  }
  return el;
}

export function checkProperties(obj: { [key: string]: any }, properties: string[]): void {
  for (const prop of properties) {
    // Check if the property exists and is not null or empty
    if (!(prop in obj && obj[prop] != null && obj[prop] !== "")) {
      throw new Error(`Property ${prop} not found`);
    }
  }
}

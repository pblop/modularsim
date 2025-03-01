type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

function setProperties<T>(target: T, properties: T) {
  for (const key in properties) {
    if (typeof properties[key] === "object") {
      setProperties(target[key], properties[key]);
    } else {
      target[key] = properties[key];
    }
  }
}

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  properties: DeepPartial<HTMLElementTagNameMap[K]> = {},
  ...children: HTMLElement[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  // Allow for children to be passed as the second argument (no properties).
  if (properties instanceof HTMLElement) {
    children.unshift(properties);
  } else {
    setProperties(el, properties);
  }

  for (const child of children) {
    el.appendChild(child);
  }
  return el;
}

export function iconButton(iconClass: string, title: string, onClick: () => void) {
  return element(
    "button",
    { className: "gui-icon-button", onclick: onClick },
    element("span", {
      className: `gui-icon ${iconClass}`,
      title: title,
    }),
  );
}

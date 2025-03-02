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

type ExtraFields<K extends keyof HTMLElementTagNameMap> = {
  customAttributes?: Record<string, string>;
  onClick?: (element: HTMLElementTagNameMap[K], ev: MouseEvent) => void;
};

export function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  properties: DeepPartial<HTMLElementTagNameMap[K]> & ExtraFields<K> = {},
  ...children: HTMLElement[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  // Allow for children to be passed as the second argument (no properties).
  if (properties instanceof HTMLElement) {
    children.unshift(properties);
  } else {
    // Remove extra fields from properties and set them separately.
    const { customAttributes, onClick } = properties;
    properties.customAttributes = undefined;
    properties.onClick = undefined;

    setProperties(el, properties as DeepPartial<HTMLElementTagNameMap[K]>);

    if (customAttributes) {
      for (const key in customAttributes) {
        el.setAttribute(key, customAttributes[key]);
      }
    }

    if (onClick) {
      el.onclick = function (ev) {
        onClick.bind(this)(el, ev);
      };
    }
  }

  for (const child of children) {
    el.appendChild(child);
  }
  return el;
}

export function iconButton(
  iconClass: string,
  title: string,
  onClick: (icon: HTMLSpanElement, button: HTMLButtonElement) => void,
): HTMLButtonElement {
  const span = element("span", {
    className: `gui-icon ${iconClass}`,
    title: title,
  });
  const button: HTMLButtonElement = element(
    "button",
    {
      className: "gui-icon-button",
      onclick: () => onClick(span, button),
    },
    span,
  );
  return button;
}

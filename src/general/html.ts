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

/**
 * Creates a table cell that can be edited in place, by clicking on it.
 * The cell requires a hex value to be entered, and will call the onChange
 * function when the user enters a valid number.
 *
 * @param options - The options for the table cell HTML element.
 * @param messages - The messages to be displayed in case of errors.
 * @param onChange - The callback function to call when the value is changed.
 * @param bytes - The number of bytes to be edited.
 * @returns The table cell element and a function to update the value.
 */
export function rewrittableTableElement(
  options: {
    className: string;
    textContent: string;
    title?: string;
    onmouseenter?: (this: GlobalEventHandlers, ev: MouseEvent) => void;
  },
  messages: {
    onlyHex: string;
  },
  onChange: (newValue: number) => void,
  bytes: number,
): HTMLTableCellElement {
  const maxValue = 2 ** (bytes * 8) - 1;

  return element("td", {
    ...options,
    onClick: (el) => {
      // If the cell already has a child element, we will ignore the click.
      if (el.childElementCount > 0) return;
      if (el.classList.contains("uneditable")) return;

      const text = el.textContent!;

      // Create an input element to edit the memory value (in place)
      const input = element("input", {
        value: text,
        type: "text",
        // The pattern matches a hex value, with or without the 0x prefix, with
        // the correct number of hex digits (2 per byte).
        pattern: `(0x)?[0-9a-fA-F]{0,${bytes * 2}}`,
        onblur: () => {
          // When the input loses focus, we will remove the input element
          // and restore the text content of the cell.
          // This happens when the user clicks outside the input element
          // or presses Enter!
          input.remove();
          el.textContent = text;
        },
        oninput: () => {
          input.setCustomValidity("");
          if (!input.checkValidity()) {
            input.setCustomValidity(messages.onlyHex);
          }
          input.reportValidity();
        },
        onkeyup: ({ key }) => {
          if (key === "Enter") {
            // If the text hasn't changed, we don't have to do anything.
            if (text.toLowerCase() === input.value.toLowerCase()) {
              input.blur();
              return;
            }

            // When the user presses Enter, we will parse the input value,
            // and emit a memory write event.
            const data = Number.parseInt(input.value, 16);
            if (Number.isNaN(data) || data < 0 || data > maxValue) {
              input.setCustomValidity(messages.onlyHex);
              input.reportValidity();
              return;
            }

            // The parent module should use the callback to write the value
            // to the actual memory, and update the cell accordingly, then.
            // This makes sure that the cell is always in sync with the memory.
            onChange(data);
          } else if (key === "Escape") {
            input.blur();
          }
        },
        onfocus: () => {
          // Select all text by default.
          input.select();
        },
      });

      // Clear the text content of the cell and append the input element.
      el.textContent = "";
      el.appendChild(input);

      input.focus();
    },
  });
}

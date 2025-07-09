import { VirtualListElement } from "./VirtualListElement";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// function setProperties<T>(target: T, properties: DeepPartial<T>) {
//   for (const key in properties) {
//     if (typeof properties[key] === "object" && properties[key] !== null) {
//       setProperties(target[key], properties[key] as DeepPartial<T[typeof key]>);
//     } else {
//       target[key] = properties[key] as T[typeof key];
//     }
//   }
// }
function setProperties<T>(target: T, properties: T) {
  for (const key in properties) {
    if (typeof properties[key] === "object") {
      setProperties(target[key], properties[key]);
    } else {
      target[key] = properties[key];
    }
  }
}

type CustomElementTags = {
  "virtual-list": VirtualListElement;
};
type ElementTags = keyof HTMLElementTagNameMap | keyof CustomElementTags;
type TagNameMap = {
  [K in ElementTags]: K extends keyof CustomElementTags
    ? CustomElementTags[K]
    : K extends keyof HTMLElementTagNameMap
      ? HTMLElementTagNameMap[K]
      : never;
};
type ExtraFields<K extends keyof TagNameMap> = {
  customAttributes?: Record<string, string>;
  cssProperties?: Record<string, string>;
  onClick?: (element: TagNameMap[K], ev: MouseEvent) => void;
  override?: TagNameMap[K];
};

export function element<K extends keyof TagNameMap>(
  tag: K,
  properties: DeepPartial<TagNameMap[K]> & ExtraFields<K> = {},
  ...children: (HTMLElement | undefined)[]
): TagNameMap[K] {
  let el: TagNameMap[K];

  // Allow for children to be passed as the second argument (no properties).
  if (properties instanceof HTMLElement) {
    children.unshift(properties);
    el = document.createElement(tag) as TagNameMap[K];
  } else {
    // Remove extra fields from properties and set them separately.
    const { customAttributes, onClick, cssProperties } = properties;
    properties.customAttributes = undefined;
    properties.onClick = undefined;
    properties.cssProperties = undefined;

    if (properties.override) {
      el = properties.override;
    } else {
      el = document.createElement(tag) as TagNameMap[K];
    }
    properties.override = undefined;

    setProperties(el, properties as DeepPartial<TagNameMap[K]>);

    if (customAttributes) {
      for (const key in customAttributes) {
        el.setAttribute(key, customAttributes[key]);
      }
    }
    if (cssProperties) {
      for (const key in cssProperties) {
        el.style.setProperty(key, cssProperties[key]);
      }
    }

    if (onClick) {
      el.onclick = function (ev) {
        onClick.bind(this)(el, ev);
      };
    }
  }

  for (const child of children) {
    if (child !== undefined) el.appendChild(child);
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
  customOptions: {
    onChange: (newValue: string) => string | void;
    bytes: number;
    pattern: string;
    validationFailedMsg: string;
    editWidth?: number; // Optional width for the input element
    overwrite?: HTMLTableCellElement; // Optional element to overwrite
  },
): HTMLTableCellElement {
  const { onChange, bytes, pattern, validationFailedMsg, editWidth, overwrite } = customOptions;

  if (options.title === undefined) {
    // If options.title is undefined, the string "undefined" will be used as the
    // title. This is not what we want, so we will delete the title property
    // biome-ignore lint/performance/noDelete: it doesn't work without delete!!
    delete options.title;
  }

  return element("td", {
    ...options,
    cssProperties: {
      "--register-edit-width": `${editWidth}ch`,
    },
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
        pattern: pattern,
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
            input.setCustomValidity(validationFailedMsg);
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

            // When the user presses Enter, we call the parent module, who
            // parses and validates the input value.
            // If the value is invalid, we will set the custom validity
            // message to be that returned by the onChange function.
            // If the value is valid, we won't do anything more.

            // The parent module should use the callback to write the value
            // to the actual memory, and update the cell accordingly, then.
            // This makes sure that the cell is always in sync with the memory.
            const message = onChange(input.value.toLowerCase());
            if (message !== undefined) {
              input.setCustomValidity(message);
              input.reportValidity();
              return;
            }

            input.blur();
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

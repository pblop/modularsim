type ItemGeneratorFunction<T> = {
  // Update the content of the node with the items
  (items: T[], node: HTMLElement): HTMLElement;
  // Make a new node
  (items: null, node: null): HTMLElement;
};

export class VirtualTableElement<T> extends HTMLElement {
  // Number of items that are rendered at once
  #visibleCount = 0;
  // Height of each item in the specified units
  #itemHeight = 40;
  #itemHeightUnits = "px";
  // Array of items to be displayed in the table
  #items: T[][] = [];
  // The elements whose content will be swapped
  #nodes: HTMLElement[] = [];
  // The indices of the items that are currently visible
  #start = 0;
  #end = 0;
  #itemGenerator: ItemGeneratorFunction<T> = (_, node) => {
    // Default item generator function
    return node || document.createElement("div");
  };

  // The height of the element before resizes (we only want to update the
  // visible items when the height changes).
  #prevHeight = 0;

  private list!: HTMLTableElement;
  private placeholder!: HTMLDivElement;
  private resizeObserver!: ResizeObserver;

  constructor() {
    super();

    this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
  }

  connectedCallback() {
    this.style.display = "block";

    this.list = document.createElement("table");
    this.appendChild(this.list);

    // Create a placeholder element with the total height of the data
    this.placeholder = document.createElement("div");
    this.list.appendChild(this.placeholder);

    this.#prevHeight = this.clientHeight;
    this.resizeObserver.observe(this);
    this.addEventListener("scroll", this.onScroll);
  }

  disconnectedCallback() {
    this.list.remove();
    this.placeholder.remove();
    this.resizeObserver.disconnect();
    this.removeEventListener("scroll", this.onScroll);
  }

  updatePlaceholder() {
    // The total height of the table is the height of each item * num of items.
    this.placeholder.style.height = `${this.#items.length * this.#itemHeight}${this.#itemHeightUnits}`;
  }

  set itemGenerator(generator: ItemGeneratorFunction<T>) {
    this.#itemGenerator = generator;
    this.updateContents();
  }
  get itemGenerator() {
    return this.#itemGenerator;
  }

  set items(newItems: T[][]) {
    this.#items = newItems;
    console.log("Items updated", newItems);
    this.updateContents();
  }
  get items() {
    return this.#items;
  }

  /**
   * After the items are changed, this function is called to update the
   * visible items and the placeholder.
   */
  updateContents() {
    this.updateVisibleItems();
    this.updateRenderBounds();
    this.updatePlaceholder();
    this.render();
  }

  createNodes() {
    if (this.#nodes.length > this.#visibleCount) {
      // There are more nodes than necessary, remove some.
      const deleted = this.#nodes.splice(this.#visibleCount);
      for (const n of deleted) this.list.removeChild(n);
    } else if (this.#nodes.length < this.#visibleCount) {
      // There are fewer nodes than necessary, add some.
      const newNodes = Array.from({ length: this.#visibleCount }, (_, i) => {
        const node = this.#itemGenerator(null, null);
        node.style.position = "absolute";
        node.style.top = `${i * this.#itemHeight}${this.#itemHeightUnits}`;
        this.list.appendChild(node);
        return node;
      });
      this.#nodes = this.#nodes.concat(newNodes);
    }
  }

  render() {
    const visibleItems = this.#items.slice(this.#start, Math.min(this.#end, this.#items.length));
    for (let i = 0; i < this.#nodes.length; i++) {
      const node = this.#nodes[i];
      if (i < visibleItems.length) {
        const item = visibleItems[i];
        this.#itemGenerator(item, node); // Update the content of the node
        // Update the position of the node based on its index in the data array.
        node.style.top = `${(this.#start + i) * this.#itemHeight}px`;
      } else {
        node.style.display = "none"; // Hide the node if it's not in the visible range
      }
    }
  }

  onScroll() {
    this.updateRenderBounds();
    this.render();
  }
  onResize(entries: ResizeObserverEntry[]) {
    const entry = entries[0];
    const height = entry.contentRect.height;
    if (height !== this.#prevHeight) {
      this.#prevHeight = height;
      this.updateVisibleItems();
    }
  }

  updateRenderBounds() {
    const scrollTop = this.scrollTop;
    this.#start = Math.floor(scrollTop / 40); // Assuming each item has a height of 40px
    this.#end = this.#start + this.#visibleCount;
  }

  updateVisibleItems() {
    this.#visibleCount = Math.ceil(this.clientHeight / this.#itemHeight) * 2;
    this.createNodes();
  }

  static define(tagName = "virtual-table") {
    if (customElements.get(tagName)) {
      console.warn(`Custom element ${tagName} is already defined.`);
    } else {
      customElements.define(tagName, VirtualTableElement);
    }
  }
}

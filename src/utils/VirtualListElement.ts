import { UpdateQueue } from "./updatequeue.js";

type ItemGeneratorFunction = {
  // Update the content of the node
  (i: number, node: HTMLElement): HTMLElement;
  // Make a new node
  (i: null, node: null): HTMLElement;
};

export class VirtualListElement extends HTMLElement {
  // Number of items that are rendered at once
  #visibleCount = 0;
  // Height of each item in the specified units
  #itemHeight = 40;
  #itemHeightUnits = "px";
  // The elements whose content will be swapped
  #nodes: HTMLElement[] = [];
  // The indices of the items that are currently visible
  #start = 0;
  #end = 0;
  #itemGenerator: ItemGeneratorFunction = (_, node) => {
    // Default item generator function
    return node || document.createElement("div");
  };
  #itemCount = 0;

  // The height of the element before resizes (we only want to update the
  // visible items when the height changes).
  #prevHeight = 0;

  // The scroll position, in items, of the list.
  #scrollPosition = 0;

  private list!: HTMLDivElement;
  private placeholder!: HTMLDivElement;
  private resizeObserver!: ResizeObserver;

  constructor() {
    super();

    this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
  }

  connectedCallback() {
    this.style.display = "block";
    this.style.overflowY = "auto";
    this.style.position = "relative";

    this.list = document.createElement("div");
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
    this.placeholder.style.height = `${this.#itemCount * this.#itemHeight}${this.#itemHeightUnits}`;
  }

  set itemGenerator(generator: ItemGeneratorFunction) {
    this.#itemGenerator = generator;
    this.updateContents();
  }
  get itemGenerator() {
    return this.#itemGenerator;
  }
  set itemCount(count: number) {
    this.#itemCount = count;
    this.updateContents();
  }
  get itemCount() {
    return this.#itemCount;
  }
  set itemHeight(height: number) {
    this.#itemHeight = height;
    this.updateContents();
  }
  get itemHeight() {
    return this.#itemHeight;
  }
  set itemHeightUnits(units: string) {
    this.#itemHeightUnits = units;
    this.updateContents();
  }
  get itemHeightUnits() {
    return this.#itemHeightUnits;
  }

  set start(value: number) {
    this.scrollTop = value * this.#itemHeightPx;
    this.#scrollPosition = value;
    this.updateContents();
  }
  get start() {
    return this.#start;
  }
  get end() {
    return this.#end;
  }

  /**
   * After the items are changed, this function is called to update the
   * visible items and the placeholder.
   */
  updateContentsQueue = new UpdateQueue(this._updateContents.bind(this));
  updateContents() {
    this.updateContentsQueue.queueUpdate();
  }
  _updateContents() {
    this.updatePlaceholder();
    this.updateVisibleItems();
    this.updateRenderBounds();
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
    const end = Math.min(this.#end, this.#itemCount);
    for (let i = 0; i < this.#nodes.length; i++) {
      const node = this.#nodes[i];
      if (this.#start + i < end) {
        this.#itemGenerator(this.#start + i, node); // Update the content of the node
        // Update the position of the node based on its index in the data array.
        node.style.top = `${(this.#start + i) * this.#itemHeight}${this.#itemHeightUnits}`;
        node.style.display = ""; // Show the node if it's in the visible range
      } else {
        node.style.display = "none"; // Hide the node if it's not in the visible range
      }
    }
  }

  // TODO: scroll queue
  // Ignore the next scroll event, used when changing the scrollTop
  ignoreNextScroll = false;
  onScroll() {
    if (this.ignoreNextScroll) {
      this.ignoreNextScroll = false;
      return;
    }
    this.#scrollPosition = this.scrollTop / this.#itemHeightPx;
    this.updateRenderBounds();
    this.render();
  }
  onResizeQueue = new UpdateQueue<ResizeObserverEntry[]>(this._onResize.bind(this));
  onResize(entries: ResizeObserverEntry[]) {
    this.onResizeQueue.queueUpdate(entries);
  }
  _onResize(entriesArray: ResizeObserverEntry[][]) {
    const entries = entriesArray[entriesArray.length - 1];
    const entry = entries[0];
    const height = entry.contentRect.height;
    if (height !== this.#prevHeight) {
      this.#prevHeight = height;

      // Because the height of the items may have changed, we need to
      // recalculate the correct scroll position. Otherwise, the list will
      // scroll to the wrong position sometimes.
      this.ignoreNextScroll = true; // Ignore the scroll event that will be triggered by changing the scrollTop
      this.scrollTop = this.#scrollPosition * this.#itemHeightPx;
      this.updateVisibleItems();
      this.updateRenderBounds();
      this.render();
    }
  }

  get #itemHeightPx() {
    if (this.#itemHeightUnits === "px") return this.#itemHeight;
    return this.placeholder.getBoundingClientRect().height / this.#itemCount || 1;
  }

  updateRenderBounds() {
    this.#start = Math.floor(this.scrollTop / this.#itemHeightPx);
    this.#end = this.#start + this.#visibleCount;
  }

  updateVisibleItems() {
    this.#visibleCount = Math.ceil(this.clientHeight / this.#itemHeightPx) * 2;
    this.createNodes();
  }

  static define(tagName = "virtual-list") {
    if (customElements.get(tagName)) {
      console.warn(`Custom element ${tagName} is already defined.`);
    } else {
      customElements.define(tagName, VirtualListElement);
    }
  }
}

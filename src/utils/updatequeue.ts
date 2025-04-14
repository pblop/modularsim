export type UpdateFn<T> = (entries: T[]) => void | Promise<void>;
export class UpdateQueue<T = never> {
  private updateQueued = false;
  private entries: T[] = [];

  constructor(private fn: UpdateFn<T>) {
    this.updateQueued = false;
  }

  queueUpdate = (newEntry?: T): void => {
    if (newEntry !== undefined) this.entries.push(newEntry);

    if (this.updateQueued) return;
    this.updateQueued = true;

    requestAnimationFrame(() => {
      const entries = this.entries.slice();
      this.entries = [];

      const res = this.fn(entries);
      if (res instanceof Promise) {
        res.then(() => {
          this.updateQueued = false;

          if (this.entries.length > 0) this.queueUpdate();
        });
      } else {
        this.updateQueued = false;
        if (this.entries.length > 0) this.queueUpdate();
      }
    });
  };
}

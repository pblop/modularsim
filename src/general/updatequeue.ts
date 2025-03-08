export type UpdateFn = () => void | Promise<void>;
export class UpdateQueue {
  private updateQueued = false;

  constructor(private fn: UpdateFn) {
    this.updateQueued = false;
  }

  queueUpdate = (): void => {
    if (this.updateQueued) return;

    this.updateQueued = true;
    const res = this.fn();
    if (res instanceof Promise) {
      res.then(() => {
        this.updateQueued = false;
      });
    } else {
      this.updateQueued = false;
    }
  };
}

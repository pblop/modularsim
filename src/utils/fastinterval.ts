export type FastIntervalCallback = () => void | Promise<void>;

export class FastInterval {
  interval: number | undefined;
  fn: FastIntervalCallback;

  break: boolean;

  constructor(fn: FastIntervalCallback) {
    this.fn = fn;
    this.break = false;
  }

  start(ms: number) {
    this.break = false;
    if (ms >= 10) {
      this.interval = setInterval(this.fn);
      return;
    } else {
      const executionsPerInterval = 10 / ms;
      this.interval = setInterval(async () => {
        if (this.break) return;

        await this.fn();
      }, 10);
    }
  }

  stop() {
    clearInterval(this.interval);
    this.break = true;
  }
}

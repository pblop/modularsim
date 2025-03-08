// Copied and modified from:
// https://gist.github.com/EvitanRelta/c3d69dde4ab6879d4126dc3f676c4bdd

const breakInterval: { [key: number]: boolean } = {};
const MIN_TIME = 0.001;

function calculateAnimationFrameTime(callback: (time: number) => void, amount = 100) {
  let sum = 0;
  let count = 0;

  const calculateOnce = (nestedness: number) => {
    if (nestedness > amount) {
      callback(sum / count);
      return;
    }

    requestAnimationFrame((ts0) => {
      requestAnimationFrame((ts1) => {
        sum += ts1 - ts0;
        count++;
        calculateOnce(nestedness + 1);
      });
    });
  };

  calculateOnce(0);
}

// NOTA: Esto tiene el problema de que ahora que hay varios ciclos por cada
// Task de JavaScript. Y ahora las partes del código que utilizan Promises se
// van a desincronizar, porque se ejecutan una vez por cada varios ciclos.
function setFastInterval<A extends unknown[]>(
  func: (...args: A) => unknown,
  time = MIN_TIME,
  ...args: A
): number {
  // If the time is greater than 10ms, we don't need to do any magic.
  if (time >= 10) return setInterval(func, time, ...args);

  // To avoid zero or negative timings
  if (time <= 0) time = MIN_TIME;

  // Number of calls per 10ms (we ignore the decimal part. setInterval doesn't
  // guarantee exact time either, so there's no need to be extremely precise).
  const callsPer10ms = 10 / time;

  // To avoid calling the function while another call is waiting for the result
  // of a Promise, we use this variable.
  let hasLastIntervalFinished = true;

  let lastIntervalEndTime = performance.now();
  const intervalCode = setInterval(async () => {
    if (!hasLastIntervalFinished) return;

    hasLastIntervalFinished = false;
    // Calls function 'callsPer10ms' times for every 10ms
    for (let i = 0; i < callsPer10ms; i++) {
      // Stops for loop when 'clearInterval' is called
      if (breakInterval[intervalCode]) {
        delete breakInterval[intervalCode];
        break;
      }

      const now = performance.now();
      // If we have already taken more than 16ms (1/60Hz), we stop the loop, and
      // allow the browser to do other stuff (like rendering).
      if (now - lastIntervalEndTime > 16) break;

      const ret = func(...args);
      // If the function returns a Promise, we wait for it to resolve
      if (ret instanceof Promise) await ret;
    }

    const now = performance.now();
    const diff = now - lastIntervalEndTime;
    const isAhead = diff < time;
    console.log(
      `Interval took: ${diff}ms (${Math.abs(diff - time)}ms ${isAhead ? "ahead" : "behind"} of ${time}ms target)`,
    );
    lastIntervalEndTime = now;

    hasLastIntervalFinished = true;
  }, 10);

  breakInterval[intervalCode] = false;
  return intervalCode;
}

function clearFastInterval(intervalCode: number): void {
  // Default 'clearInterval' behaviour
  if (breakInterval[intervalCode] === undefined) {
    clearInterval(intervalCode);
    return;
  }

  clearInterval(intervalCode);
  breakInterval[intervalCode] = true;
}

export { setFastInterval, clearFastInterval };

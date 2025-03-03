// Copied and modified from:
// https://gist.github.com/EvitanRelta/c3d69dde4ab6879d4126dc3f676c4bdd

const breakInterval: { [key: number]: boolean } = {};
const MIN_TIME = 0.001;

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

  const intervalCode = setInterval(async () => {
    // Calls function 'callsPer10ms' times for every 10ms
    for (let i = 0; i < callsPer10ms; i++) {
      // Stops for loop when 'clearInterval' is called
      if (breakInterval[intervalCode]) {
        delete breakInterval[intervalCode];
        break;
      }

      const ret = func(...args);
      // If the function returns a Promise, we wait for it to resolve
      if (ret instanceof Promise) await ret;
    }
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

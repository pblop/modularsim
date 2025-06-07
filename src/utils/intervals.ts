// Copied and modified from:
// https://gist.github.com/EvitanRelta/c3d69dde4ab6879d4126dc3f676c4bdd

// Add declaration for scheduler in globalThis (experimental)

const breakInterval: { [key: number]: boolean } = {};
/**
 * The return value of setInterva/setTimeout is a positive integer
 * (https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval#return_value).
 * So, to make sure the yieldingTimer numbers are unique, we start at -1 and
 * go down. So our numbers will be negative.
 */
let nextYieldingTimerId = -1;
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

const BATCH_TIME = 16; // 10ms

type TimerOptions<K extends string = ""> = {
  immediate: boolean;
  frequencyReportInterval: number; // in ms
  frequencyReportCallback?: (frequency: number) => void;
  intervalIdObject?: { [P in K]?: number }; // Object to store the interval ID
  // If provided, the interval ID will be stored in this property of the
  // intervalIdObject. This is useful for the edge case where you want to
  // stop the clock during the first tick on an immediate call.
  // Example:
  // I start the timer with immediate: true, and during the first tick the CPU
  // finishes an instruction and calls clock, and it tries to stop the timer.
  // Because the function is called immediately (during the setTimer function),
  // the interval ID is not available yet (we haven't returned from the setTimer
  // function). Using this, we can store the interval ID in the object, just
  // before the first immediate call to the function.
  intervalIdName?: K;
};
const DEFAULT_OPTIONS: TimerOptions = {
  immediate: true,
  frequencyReportInterval: 0,
};

function setTimer<A extends unknown[], K extends string>(
  func: (...args: A) => unknown,
  time: number,
  options: Partial<TimerOptions<K>> = {},
  ...args: A
): number {
  // If the time is greater than 10ms, we don't need to do any magic.
  if (time >= BATCH_TIME) return setInterval(func, time, ...args);

  // To avoid zero or negative timings
  if (time <= 0) time = MIN_TIME;

  const fullOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // if (globalThis?.scheduler?.yield) {
  //   console.log("Using yielding timer");
  //   return yieldingTimer(func, time, {}, ...args);
  // } else {
  //   console.log("Using interval timer");
  //@ts-ignore
  return intervalTimer<A, K>(func, time, fullOptions, ...args);
  // }
}

function yieldingTimer<A extends unknown[]>(
  func: (...args: A) => unknown,
  time = MIN_TIME,
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  options: {} = {},
  ...args: A
): number {
  const id = nextYieldingTimerId--;

  // Number of calls per 10ms (we ignore the decimal part)..
  const callsPerBatch = BATCH_TIME / time;

  async function yieldingTimerAsyncFunc() {
    breakInterval[id] = false;
    let lastEndTime = 0;
    while (true) {
      const startTime = performance.now();
      if (lastEndTime > 0) console.warn(`Yielding took ${startTime - lastEndTime}ms`);
      let endTime = 0;
      for (let i = 0; i < callsPerBatch; i++) {
        if (breakInterval[id]) {
          delete breakInterval[id];
          return;
        }

        const ret = func(...args);
        // If the function returns a Promise, we wait for it to resolve
        if (ret instanceof Promise) await ret;

        const isBatchDone = callsPerBatch - 1 === i;
        if (isBatchDone || i % 1000 === 0) {
          endTime = performance.now();
          if (!isBatchDone) {
            const timeInBatch = endTime - startTime;
            if (timeInBatch > BATCH_TIME) {
              console.warn(
                `Interval took too long: ${timeInBatch}ms > ${BATCH_TIME}ms, ${(i / callsPerBatch) * 100}% done`,
              );
              break;
            }
          }
        }
      }

      lastEndTime = endTime;
      await globalThis!.scheduler!.yield!();
    }
  }

  yieldingTimerAsyncFunc();
  return id;
}

// NOTA: Esto tiene el problema de que ahora que hay varios ciclos por cada
// Task de JavaScript. Y ahora las partes del código que utilizan Promises se
// van a desincronizar, porque se ejecutan una vez por cada varios ciclos.
function intervalTimer<A extends unknown[], K extends string>(
  func: (...args: A) => unknown,
  time: number,
  options: TimerOptions<K>,
  ...args: A
): number {
  // Number of calls per 10ms (we ignore the decimal part. setInterval doesn't
  // guarantee exact time either, so there's no need to be extremely precise).
  const callsPerBatch = BATCH_TIME / time;

  // To avoid calling the function while another call is waiting for the result
  // of a Promise, we use this variable.
  let hasLastIntervalFinished = true;
  // Info about the last interval, to provide some feedback on the console.
  let lastIntervalEndTime = performance.now();
  let isTooSlow = false;

  // For measuring the real frequency of the interval.
  let executionCount = 0;
  let lastReportTime = lastIntervalEndTime;

  const intervalFn = async () => {
    if (!hasLastIntervalFinished) {
      console.warn("Interval called before last interval finished!!");
      return;
    }
    hasLastIntervalFinished = false;

    // We want to match the time of the interval with the time of the frame, and
    // be called immediately after the last interval finished.
    // We use the time of the last interval to calculate the time of the next
    // interval.
    const intervalStartTime = performance.now();
    // if there was a previous interval
    if (isTooSlow) {
      // we want the time between the last interval and the current one to be
      // as close to zero as possible.
      const timeBetweenCalls = intervalStartTime - lastIntervalEndTime;

      if (timeBetweenCalls > 0) {
        // console.warn(`Interval called too late: ${timeBetweenCalls}ms, when it should be 0ms`);
        // If we've been called too late, we want to add more calls per batch
        // to make up for the time lost.
      }
    }

    isTooSlow = false;
    // Calls function 'callsPerBatch' times for every BATCH_TIME ms.
    for (let i = 0; i < callsPerBatch; i++) {
      // Stops for loop when 'clearInterval' is called
      if (breakInterval[intervalCode]) {
        delete breakInterval[intervalCode];
        break;
      }

      const ret = func(...args);
      executionCount++;
      // If the function returns a Promise, we wait for it to resolve
      if (ret instanceof Promise) await ret;

      const now = performance.now();
      // If we have already taken more than 16ms (1/60Hz), we stop the loop, and
      // allow the browser to do other stuff (like rendering).
      const timeInBatch = now - intervalStartTime;
      if (timeInBatch > BATCH_TIME) {
        // console.warn(
        //   `Interval took too long: ${timeInBatch}ms > ${BATCH_TIME}ms, ${(i / callsPerBatch) * 100}% done`,
        // );
        isTooSlow = true;
        break;
      }
      if (
        options.frequencyReportInterval > 0 &&
        now - lastReportTime > options.frequencyReportInterval
      ) {
        const elapsedSeconds = (now - lastReportTime) / 1000;
        const frequency = executionCount / elapsedSeconds;
        if (options.frequencyReportCallback) {
          options.frequencyReportCallback(frequency);
        } else {
          console.log(`Interval frequency: ${frequency.toFixed(2)}Hz`);
        }

        lastReportTime = now;
        executionCount = 0;
      }
    }

    const intervalEndTime = performance.now();
    // const diff = intervalEndTime - intervalStartTime;
    // const isAhead = diff < time;
    // console.log(
    //   `Interval took: ${diff}ms (${Math.abs(diff - time)}ms ${
    //     isAhead ? "ahead" : "behind"
    //   } of ${time}ms target)`,
    // );

    lastIntervalEndTime = intervalEndTime;
    hasLastIntervalFinished = true;
  };

  const intervalCode = setInterval(intervalFn, BATCH_TIME);
  // If we have been provided an object and a name, we store the interval ID
  // in that object.
  if (options.intervalIdObject && options.intervalIdName)
    options.intervalIdObject[options.intervalIdName] = intervalCode;

  breakInterval[intervalCode] = false;
  if (options.immediate) {
    intervalFn(); // setInterval doesn't call the function immediately, so we call it
    // manually the first time.
  }

  return intervalCode;
}

function clearTimer(intervalCode: number): void {
  // If the intervalCode is positive, it's a normal setInterval, and we can just
  // clear it.
  if (intervalCode >= 0) {
    // Default 'clearInterval' behaviour
    clearInterval(intervalCode);
  }

  // If we don't have a key in breakInterval, it means that the interval was not
  // created by us, so we don't need to do anything.
  if (breakInterval[intervalCode] === undefined) return;

  // Mark the interval as broken, so we can stop the loop in the next
  // iteration.
  breakInterval[intervalCode] = true;
}

export { setTimer, clearTimer };

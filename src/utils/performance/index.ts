import { env } from "@/env";

/**
 * A class that wraps console.time and console.timeLog to measure performance
 * of a function.
 *
 * If the environment variable PERFORMANCE_DEBUG is not set to true, the timer
 * will not be used.
 *
 *
 * @method start - Starts the timer.
 * @method end - Ends the timer and returns the time in milliseconds.
 *
 * @param name - The name of the function being measured.
 *
 * @example
 * ```ts
 * const timer = new performanceTimer("myFunction");
 * timer.start();
 * expensiveFunction();
 * timer.end();
 * ```
 *
 */
export class performanceTimer {
  private name: string;
  constructor(name: string) {
    this.name = name + ":\n" + new Date().toISOString() +"\t";
  }
  start() {
    if (!env.PERFORMANCE_DEBUG) return;
    console.time(this.name);
  }
  /**
   *
   * @returns The time in milliseconds that the function took to execute.
   */
  end() {
    if (!env.PERFORMANCE_DEBUG) return;
    const time = console.timeLog(this.name, "ms\n");
    return time;
  }
}

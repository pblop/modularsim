export interface Thenable<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Thenable.
   * @param onfulfilled The callback to execute when resolved.
   * @param onrejected The callback to execute when rejected.
   * @returns A Thenable for the completion of whichever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled: (value: T) => TResult1 | Thenable<TResult1>,
    onrejected: (reason: unknown) => TResult2 | Thenable<TResult2>,
    // biome-ignore lint/suspicious/noConfusingVoidType: <it is not confusing>
  ): Thenable<TResult1 | TResult2> | void;
}

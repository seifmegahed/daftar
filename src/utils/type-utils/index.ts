export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type ReturnTuple<T> = readonly [T, null] | readonly [null, string];

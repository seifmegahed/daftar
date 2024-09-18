export const emptyToUndefined = (value: string) =>
  value === "" ? undefined : value;

export const emptyToNull = (value: string) => (value === "" ? null : value);

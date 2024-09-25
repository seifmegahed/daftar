export const emptyToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

export const emptyToNull = (value: unknown) => (value === "" ? null : value);

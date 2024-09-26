export const emptyToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

export const emptyToNull = (value: unknown) => (value === "" ? null : value);

export const isExactlyOneDefined = <T extends object>(obj: T): boolean => {
  const definedValues = Object.values(obj).filter(
    (value) => value !== null && value !== undefined,
  );
  return definedValues.length === 1;
};

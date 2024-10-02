export const emptyToUndefined = (value: unknown) =>
  value === "" ? undefined : value;

export const emptyToNull = (value: unknown) => (value === "" ? null : value);

export const isExactlyOneDefined = <T extends object>(obj: T): boolean => {
  const definedValues = Object.values(obj).filter(
    (value) => value !== null && value !== undefined,
  );
  return definedValues.length === 1;
};

export const numberWithCommas = (n: number) =>
  n
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const toDBDate = (date?: Date) =>
  date
    ? date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    : null;

export const prepareSearchText = (searchText: string) => {
  searchText = searchText.trim().replace(/\s+/g, " ").toLowerCase();
  if (!searchText) return "";
  const searchTextArray = searchText.split(" ");
  searchTextArray[searchTextArray.length - 1] += ":*";
  return searchTextArray.join(" | ");
};

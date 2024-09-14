export const getInitials = (name: string): string => {
  const [first, last] = name.split(" ");
  const initials = ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase();
  if (initials === "") return "?";
  return initials;
};

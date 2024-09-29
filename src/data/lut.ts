export const statusCodes = [
  { value: 0, label: "Active" },
  { value: 1, label: "Inactive" },
  { value: 2, label: "Archived" },
  { value: 3, label: "Pending" },
  { value: 4, label: "Rejected" },
  { value: 5, label: "Cancelled" },
  { value: 6, label: "Completed" },
  { value: 7, label: "On Hold" },
  { value: 8, label: "Pending" },
  { value: 9, label: "Pending" },
  { value: 10, label: "Pending" },
  { value: 11, label: "Issue" },
];

export const getStatusLabel = (status: number) =>
  statusCodes.find((x) => x.value === status)?.label ?? "Unknown";

export const currencyOptions = [
  { value: 0, label: "USD" },
  { value: 1, label: "EUR" },
  { value: 2, label: "GBP" },
  { value: 3, label: "JPY" },
  { value: 4, label: "INR" },
  { value: 5, label: "CNY" },
  { value: 7, label: "AED" },
  { value: 8, label: "SAR" },
  { value: 9, label: "EGP" },
];

export const getCurrencyLabel = (currency: number) =>
  currencyOptions.find((x) => x.value === currency)?.label ?? "Unknown";

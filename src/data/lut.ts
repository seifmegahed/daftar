import { getLocale } from "next-intl/server";

export const statusCodes = [
  { value: 0, label: "Active", en: "Active", ar: "مفعل" },
  { value: 1, label: "Inactive", en: "Inactive", ar: "غير مفعل" },
  { value: 2, label: "Archived", en: "Archived", ar: "محفوظ" },
  { value: 3, label: "Pending", en: "Pending", ar: "قيد الانتظار" },
  { value: 4, label: "Rejected", en: "Rejected", ar: "مرفوض" },
  { value: 5, label: "Cancelled", en: "Cancelled", ar: "ملغى" },
  { value: 6, label: "Completed", en: "Completed", ar: "منتهي" },
  { value: 7, label: "On Hold", en: "On Hold", ar: "محجوز" },
  { value: 8, label: "Pending", en: "Pending", ar: "قيد الانتظار" },
  {
    value: 9,
    label: "Awaiting Approval",
    en: "Awaiting Approval",
    ar: "في انتظار الموافقة",
  },
  { value: 10, label: "Approved", en: "Approved", ar: "موافق" },
  { value: 11, label: "Issue", en: "Issue", ar: "مشكلة" },
];

export const getStatusLabel = (status: number) =>
  statusCodes.find((x) => x.value === status)?.label ?? "Unknown";

export const getLocalizedStatusLabel = async (status: number) => {
  const locale = (await getLocale()) as "ar" | "en";
  return statusCodes.find((x) => x.value === status)?.[locale] ?? "Unknown";
};

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

export const projectTypes = [
  { value: 0, label: "Supply" },
  { value: 1, label: "Service" },
  { value: 2, label: "Budgetary" },
];

export const getProjectTypeLabel = (type: number) =>
  projectTypes.find((x) => x.value === type)?.label ?? "Unknown";

export const userRoles = {
  admin: "admin",
  sUser: "s-user",
  user: "user",
};

export const userRolesList = [
  { value: "admin", label: "Admin" },
  { value: "s-user", label: "Super User" },
  { value: "user", label: "User" },
];

export const getUserRoleLabel = (role: string) =>
  userRolesList.find((x) => x.value === role)?.label ?? "Unknown";

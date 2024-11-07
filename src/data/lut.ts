export const statusCodes = [
  {
    value: 0,
    label: "Active",
    en: "Active",
    ar: "مفعل",
    es: "Activo",
    nl: "Actief",
  },
  {
    value: 1,
    label: "Inactive",
    en: "Inactive",
    ar: "غير مفعل",
    es: "Inactivo",
    nl: "Inactief",
  },
  {
    value: 2,
    label: "Archived",
    en: "Archived",
    ar: "محفوظ",
    es: "Archivado",
    nl: "Gearchiveerd",
  },
  {
    value: 3,
    label: "Pending",
    en: "Pending",
    ar: "قيد الانتظار",
    es: "Pendiente",
    nl: "In afwachting",
  },
  {
    value: 4,
    label: "Rejected",
    en: "Rejected",
    ar: "مرفوض",
    es: "Rechazado",
    nl: "Afgewezen",
  },
  {
    value: 5,
    label: "Cancelled",
    en: "Cancelled",
    ar: "ملغى",
    es: "Cancelado",
    nl: "Geannuleerd",
  },
  {
    value: 6,
    label: "Completed",
    en: "Completed",
    ar: "منتهي",
    es: "Completado",
    nl: "Voltooid",
  },
  {
    value: 7,
    label: "On Hold",
    en: "On Hold",
    ar: "محجوز",
    es: "En espera",
    nl: "In wacht",
  },
  {
    value: 8,
    label: "Pending",
    en: "Pending",
    ar: "قيد الانتظار",
    es: "Pendiente",
    nl: "In afwachting",
  },
  {
    value: 9,
    label: "Awaiting Approval",
    en: "Awaiting Approval",
    ar: "في انتظار الموافقة",
    es: "Pendiente de aprobación",
    nl: "Wacht op goedkeuring",
  },
  {
    value: 10,
    label: "Approved",
    en: "Approved",
    ar: "موافق",
    es: "Aprobado",
    nl: "Goedgekeurd",
  },
  {
    value: 11,
    label: "Issue",
    en: "Issue",
    ar: "مشكلة",
    es: "Problema",
    nl: "Probleem",
  },
];

export const getStatusLabel = (status: number) =>
  statusCodes.find((x) => x.value === status)?.label ?? "Unknown";

export const getLocalizedStatusLabel = (
  status: number,
  locale: Locale = "en",
) => statusCodes.find((x) => x.value === status)?.[locale] ?? "Unknown";

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
  {
    value: 0,
    label: "Supply",
    en: "Supply",
    ar: "توريد",
    es: "Suministro",
    nl: "Inkoop",
  },
  {
    value: 1,
    label: "Service",
    en: "Service",
    ar: "صيانة",
    es: "Servicio",
    nl: "Service",
  },
  {
    value: 2,
    label: "Budgetary",
    en: "Budgetary",
    ar: "دراسة مالية",
    es: "Presupuesto",
    nl: "Budget",
  },
];

export const getProjectTypeLabel = (type: number) =>
  projectTypes.find((x) => x.value === type)?.label ?? "Unknown";

export const getLocalizedProjectTypeLabel = (type: number, locale: Locale) =>
  projectTypes.find((x) => x.value === type)?.[locale] ?? "Unknown";

export const userRoles = {
  admin: "admin",
  sUser: "s-user",
  user: "user",
};

export const userRolesList = [
  {
    value: "admin",
    label: "Admin",
    en: "Admin",
    ar: "مدير",
    es: "Administrador",
    nl: "Beheerder",
  },
  {
    value: "s-user",
    label: "Super User",
    en: "Super User",
    ar: "مستخدم مميز",
    es: "Superusuario",
    nl: "Supergebruiker",
  },
  {
    value: "user",
    label: "User",
    en: "User",
    ar: "مستخدم",
    es: "Usuario",
    nl: "Gebruiker",
  },
];

export const getUserRoleLabel = (role: string) =>
  userRolesList.find((x) => x.value === role)?.label ?? "Unknown";

export const getLocalizedUserRoleLabel = (role: string, locale: Locale) =>
  userRolesList.find((x) => x.value === role)?.[locale] ?? "Unknown";

import { ar, de, enUS, es, fr, nl } from "date-fns/locale";
import { between, gte, lte, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

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

export const DATE_SEPARATOR = "XX";

const dateToString = (date?: Date) => {
  if (!date) return "n";
  return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("-");
};

const dateParser = (value?: string) =>
  !value || value === "n" ? undefined : new Date(value);

export const parseURLDates = (
  value?: string,
): [Date | undefined, Date | undefined] => {
  if (!value) return [undefined, undefined];
  const [from, to] = value.split(DATE_SEPARATOR);
  return [dateParser(from), dateParser(to)];
};

export const datesToURLString = (
  from: Date | undefined,
  to: Date | undefined,
) => dateToString(from) + DATE_SEPARATOR + dateToString(to);

const dateToStringForQuery = (date?: Date) =>
  date
    ? [
        date.getFullYear(),
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1,
        date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
      ].join("")
    : undefined;

const parseURLDatesForQuery = (urlDates?: string) => {
  const [from, to] = parseURLDates(urlDates);
  return [dateToStringForQuery(from), dateToStringForQuery(to)];
};

export const dateQueryGenerator = (
  column: PgColumn,
  urlDates: string | null,
) => {
  if (!urlDates) return sql`true`;
  const [from, to] = parseURLDatesForQuery(urlDates);
  if (!from && !to) return sql`true`;
  if (!from && to) return lte(column, to);
  if (from && !to) return gte(column, from);
  return between(column, from, to);
};

export const timestampQueryGenerator = (
  column: PgColumn,
  urlDates: string | null,
) => {
  if (!urlDates) return sql`true`;
  const [from, to] = parseURLDates(urlDates);
  if (!from && !to) return sql`true`;
  if (!from && to) return lte(column, to);
  if (from && !to) return gte(column, from);
  return between(column, from, to);
};

export const getDateLocaleFormat = (locale: string) => {
  switch (locale) {
    case "ar":
      return ar;
    case "es":
      return es;
    case "en":
      return enUS;
    case "nl":
      return nl;
    case "fr":
      return fr;
    case "de":
      return de;
    default:
      return enUS;
  }
};

export const getDirection = (locale: string) =>
  locale === "ar" ? "rtl" : "ltr";

const types = {
  client: {
    en: "Client",
    ar: "عميل",
    es: "Cliente",
    nl: "Klant",
    fr: "Client",
    de: "Kunde",
  },
  supplier: {
    en: "Supplier",
    ar: "مورد",
    es: "Proveedor",
    nl: "Leverancier",
    fr: "Fournisseur",
    de: "Lieferant",
  },
  project: {
    en: "Project",
    ar: "مشروع",
    es: "Proyecto",
    nl: "Project",
    fr: "Projet",
    de: "Projekt",
  },
  item: {
    en: "Item",
    ar: "مادة",
    es: "Artículo",
    nl: "Item",
    fr: "Article",
    de: "Artikel",
  },
  document: {
    en: "Document",
    ar: "مستند",
    es: "Documento",
    nl: "Document",
    fr: "Document",
    de: "Dokument",
  },
  user: {
    en: "User",
    ar: "مستخدم",
    es: "Usuario",
    nl: "Gebruiker",
    fr: "Utilisateur",
    de: "Benutzer",
  },
};

export const getLocaleType = (type: keyof typeof types, locale: Locale) =>
  types[type][locale];

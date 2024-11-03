import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "./routing";

export type LocaleParams = { locale: Locale };

export const setLocale = (locale: Locale) =>
  setRequestLocale(locale);

export const setValidatedLocale = (locale: Locale) => {
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);
};

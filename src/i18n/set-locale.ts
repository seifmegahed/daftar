import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "./routing";

export type LocaleParams = { locale: "en" | "ar" };

export const setLocale = (locale: LocaleParams["locale"]) =>
  setRequestLocale(locale);

export const setValidatedLocale = (locale: LocaleParams["locale"]) => {
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);
};

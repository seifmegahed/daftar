"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { getDirection } from "@/utils/common";

function LanguageButton() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (_locale?: Locale) => {
    if (!_locale) return;
    router.push(pathname, { locale: _locale });
  };

  const switchToEn = () =>
    locale === "en" ? switchLocale() : switchLocale("en");
  const switchToAr = () =>
    locale === "ar" ? switchLocale() : switchLocale("ar");
  const switchToEs = () =>
    locale === "es" ? switchLocale() : switchLocale("es");
  const switchToNl = () =>
    locale === "nl" ? switchLocale() : switchLocale("nl");
  const switchToFr = () =>
    locale === "fr" ? switchLocale() : switchLocale("fr");
  const switchToDe = () =>
    locale === "de" ? switchLocale() : switchLocale("de");

  const direction = getDirection(locale);

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-full border-none text-muted-foreground duration-300 ease-in-out hover:text-muted-foreground"
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem
          className="cursor-pointer text-left"
          onClick={switchToDe}
        >
          <p className="w-full">Deutsch</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-left"
          onClick={switchToEn}
        >
          <p className="w-full">English</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-left"
          onClick={switchToEs}
        >
          <p className="w-full">Español</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-left"
          onClick={switchToFr}
        >
          <p className="w-full">Français</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-left"
          onClick={switchToNl}
        >
          <p className="w-full">Nederlands</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-right"
          onClick={switchToAr}
        >
          <p className="w-full">العربية</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageButton;

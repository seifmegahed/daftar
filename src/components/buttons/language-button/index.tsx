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

  const switchLocale = (_locale?: "ar" | "en") => {
    if (!_locale) return;
    router.push(pathname, { locale: _locale });
  };

  const switchToEn = () =>
    locale === "en" ? switchLocale() : switchLocale("en");
  const switchToAr = () =>
    locale === "ar" ? switchLocale() : switchLocale("ar");

  const direction = getDirection(locale);

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-none text-muted-foreground hover:text-muted-foreground size-10 duration-300 ease-in-out"
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuItem
          className="cursor-pointer text-left"
          onClick={switchToEn}
        >
          <p className="w-full">English</p>
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

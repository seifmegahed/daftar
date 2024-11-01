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
import { useLayoutEffect, useState } from "react";

function LanguageButton() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState<Direction>("ltr");

  useLayoutEffect(() => {
    if (!document) return;
    setDirection(document.dir as Direction);
  }, []);

  const switchLocale = (_locale?: "ar" | "en") => {
    if (!_locale) return;
    router.push(pathname, { locale: _locale });
  };

  const switchToEn = () =>
    locale === "en" ? switchLocale() : switchLocale("en");
  const switchToAr = () =>
    locale === "ar" ? switchLocale() : switchLocale("ar");

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-none text-muted-foreground"
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

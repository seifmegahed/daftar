"use client";

import { useEffect } from "react";
import { Check, Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";

import { FILTER_TYPE, FILTER_VALUE } from ".";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FilterTypes } from ".";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

function FilterContextMenu({
  value,
  onChange,
  filterItems,
}: {
  value: FilterTypes;
  onChange: (value: FilterTypes) => void;
  filterItems: { label: string; value: FilterTypes }[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("filter");
  const locale = useLocale();
  const direction = getDirection(locale);

  useEffect(() => {
    if (value === null && searchParams.has(FILTER_TYPE)) {
      const params = new URLSearchParams(searchParams);
      params.delete(FILTER_TYPE);
      params.delete(FILTER_VALUE);
      router.replace(`${pathname}?${params.toString()}`);
    }
  });

  return (
    <DropdownMenu dir={direction}>
      <Tooltip>
        <TooltipTrigger>
          <DropdownMenuTrigger asChild>
            <div className="flex size-10 cursor-pointer items-center justify-center rounded-full border text-muted-foreground hover:bg-muted">
              <Filter className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("tip")}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>{t("filter-title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filterItems.map((item) => (
          <MenuItem
            {...item}
            onClick={onChange}
            currentValue={value}
            key={item.value}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const MenuItem = ({
  currentValue,
  onClick,
  value,
  label,
  locale,
}: {
  currentValue: FilterTypes;
  onClick: (value: FilterTypes) => void;
  value: FilterTypes;
  label: string;
  locale?: { en: string; ar: string };
}) => {
  const isSelected = value === currentValue;
  const _locale = useLocale() as "en" | "ar";
  const localizedLabel = locale ? locale[_locale] : label;
  return (
    <DropdownMenuItem onClick={() => onClick(isSelected ? null : value)}>
      <div className="flex w-full items-center justify-between">
        <p>{localizedLabel} </p>
        {isSelected && <Check className="h-4 w-4" />}
      </div>
    </DropdownMenuItem>
  );
};

export default FilterContextMenu;

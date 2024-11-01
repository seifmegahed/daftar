"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { FILTER_TYPE, FILTER_VALUE } from ".";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import { getDirection } from "@/utils/common";

function SelectFilter({
  defaultValue,
  options,
  type,
  label,
}: {
  defaultValue?: string;
  options: { label: string; value: number }[];
  type: string;
  label: string;
}) {
  const [filterValue, setFilterValue] = useState<string | undefined>(
    defaultValue,
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (filterValue && filterValue !== defaultValue) {
      const params = new URLSearchParams(searchParams);
      params.set(FILTER_TYPE, type);
      params.set(FILTER_VALUE, filterValue);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [filterValue, pathname, searchParams, router, defaultValue, type]);

  const locale = useLocale();
  const t = useTranslations("filter");
  const direction = getDirection(locale);

  return (
    <div className="flex w-[300px] flex-col gap-2">
      <Label>{label}</Label>
      <Select
        onValueChange={setFilterValue}
        value={filterValue}
        dir={direction}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={t("select-placeholder")}
            defaultValue={undefined}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={String(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectFilter;

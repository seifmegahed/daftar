import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";

import DatePicker from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { FILTER_TYPE, FILTER_VALUE } from ".";
import type { FilterTypes } from ".";
import { datesToURLString, parseURLDates } from "@/utils/common";
import { useTranslations } from "next-intl";

function DateFilter({
  defaultValue,
  type,
}: {
  defaultValue?: string;
  type: FilterTypes;
}) {
  const today = new Date();
  const monthInPast = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );
  const [defaultFrom, defaultTo] = parseURLDates(defaultValue);
  const [fromDate, setFromDate] = useState<Date | undefined>(
    defaultFrom ?? monthInPast,
  );
  const [toDate, setToDate] = useState<Date | undefined>(defaultTo ?? today);
  const [change, setChange] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleFilter = () => {
      const params = new URLSearchParams(searchParams);
      if ((!fromDate && !toDate) || !type) {
        params.delete(FILTER_TYPE);
        params.delete(FILTER_VALUE);
      } else {
        params.set(FILTER_TYPE, type);
        params.set(FILTER_VALUE, datesToURLString(fromDate, toDate));
      }
      if (change) {
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
        setChange(false);
      }
    };
    const debounce = setTimeout(handleFilter, 500);
    return () => {
      clearTimeout(debounce);
    };
  }, [fromDate, toDate, pathname, searchParams, router, change, type]);

  const t = useTranslations("filter");
  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <div className="flex flex-col gap-2">
        <Label>{t("from")}</Label>
        <DatePicker
          onChange={(value) => {
            setFromDate(value);
            setChange(true);
          }}
          date={fromDate}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("to")}</Label>
        <DatePicker
          onChange={(value) => {
            setToDate(value);
            setChange(true);
          }}
          date={toDate}
        />
      </div>
    </div>
  );
}

export default DateFilter;

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DatePicker from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { FILTER_TYPE, FILTER_VALUE } from ".";

const DATE_SEPARATOR = "XX";

const dateToString = (date?: Date) => {
  if (!date) return "n";
  return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("-");
};

const dateParser = (value?: string) =>
  (!value || value === "n") ? undefined : new Date(value);

const parseURLDates = (
  value?: string,
): [Date | undefined, Date | undefined] => {
  if (!value) return [undefined, undefined];
  const [from, to] = value.split(DATE_SEPARATOR);
  return [dateParser(from), dateParser(to)];
};

function DateFilter({ defaultValue }: { defaultValue?: string }) {
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

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (!fromDate && !toDate) {
      params.delete(FILTER_TYPE);
      params.delete(FILTER_VALUE);
    } else {
      params.set(FILTER_TYPE, "startDate");
      params.set(
        FILTER_VALUE,
        dateToString(fromDate) + "XX" + dateToString(toDate),
      );
      params.set("page", "1");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [fromDate, toDate, pathname, searchParams, router]);

  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <div className="flex flex-col gap-2">
        <Label>From</Label>
        <DatePicker onChange={setFromDate} date={fromDate} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>To</Label>
        <DatePicker onChange={setToDate} date={toDate} />
      </div>
    </div>
  );
}

export default DateFilter;

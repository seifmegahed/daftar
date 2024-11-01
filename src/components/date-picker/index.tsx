"use client";

import { Popover, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import YearSelect from "./year-select";
import TriggerButton from "./trigger-button";
import { getDataLocaleFormat } from "@/utils/common";
import { useLocale } from "next-intl";

function DatePicker({
  date,
  className,
  allowFuture,
  onChange,
}: {
  date?: Date;
  className?: string;
  allowFuture?: boolean;
  onChange: (date?: Date) => void;
}) {
  const disabledDates = (date: Date) => {
    if (allowFuture) return date < new Date("1900-01-01");
    return date > new Date() || date < new Date("1900-01-01");
  };

  const locale = useLocale();

  return (
    <Popover>
      <TriggerButton date={date} className={className} />
      <PopoverContent className="w-auto p-0">
        <YearSelect date={date} onChange={onChange} />
        <Calendar
          locale={getDataLocaleFormat(locale)}
          mode="single"
          month={date ?? new Date()}
          onMonthChange={(_date) => onChange(_date)}
          selected={date}
          onSelect={onChange}
          disabled={disabledDates}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;

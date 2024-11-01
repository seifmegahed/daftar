"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLocale } from "next-intl";

const numberOfYears = 100;
const currentYear = new Date().getFullYear();

const arrayOfYears = Array.from({ length: numberOfYears }).map(
  (_, i) => currentYear - i,
);

function YearSelect ({
  date,
  onChange,
}: {
  date?: Date;
  onChange: (date?: Date) => void;
}) {
  const locale = useLocale();
  const direction = locale === "ar" ? "rtl" : "ltr";
  return (
    <Select
      onValueChange={(value) =>
        onChange(
          new Date(Number(value), date?.getMonth() ?? 0, date?.getDate() ?? 1),
        )
      }
      dir={direction}
    >
      <SelectTrigger className="font-bold">
        <div className="flex-grow">
          {date?.getFullYear() ?? new Date().getFullYear()}
        </div>
      </SelectTrigger>
      <SelectContent position="popper">
        {arrayOfYears.map((year) => (
          <SelectItem key={year} value={year + ""} className="text-center">
            <div className="w-full text-center">{year}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelect;

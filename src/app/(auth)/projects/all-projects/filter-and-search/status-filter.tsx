"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusCodes } from "@/data/lut";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FILTER_TYPE, FILTER_VALUE } from ".";
import { Label } from "@/components/ui/label";

function StatusFilter({ defaultValue }: { defaultValue?: string }) {
  const [filterValue, setFilterValue] = useState<string | undefined>(
    defaultValue,
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (filterValue && filterValue !== defaultValue) {
      const params = new URLSearchParams(searchParams);
      params.set(FILTER_TYPE, "status");
      params.set(FILTER_VALUE, filterValue);
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [filterValue, pathname, searchParams, router, defaultValue]);

  return (
    <div className="flex w-[300px] flex-col gap-2">
      <Label>Status</Label>
      <Select onValueChange={setFilterValue} value={filterValue}>
        <SelectTrigger>
          <SelectValue
            placeholder="Select filter value"
            defaultValue={undefined}
          />
        </SelectTrigger>
        <SelectContent>
          {statusCodes.map((status) => (
            <SelectItem
              key={status.value}
              value={String(status.value)}
              className="cursor-pointer"
            >
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default StatusFilter;

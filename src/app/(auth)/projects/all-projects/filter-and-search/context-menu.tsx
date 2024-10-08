"use client";

import { Check, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FILTER_TYPE, FILTER_VALUE, type FilterTypes } from ".";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const filterItems: { label: string; value: FilterTypes }[] = [
  { label: "By Status", value: "status" },
  { label: "By Start Date", value: "startDate" },
  { label: "By End Date", value: "endDate" },
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

function FilterContextMenu({
  value,
  onChange,
}: {
  value: FilterTypes;
  onChange: (value: FilterTypes) => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (value === null) {
      const params = new URLSearchParams(searchParams);
      params.delete(FILTER_TYPE);
      params.delete(FILTER_VALUE);
      router.replace(`${pathname}?${params.toString()}`);
      console.log(value)
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex size-10 cursor-pointer items-center justify-center rounded-full border text-muted-foreground hover:bg-muted">
          <Filter className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
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
}: {
  currentValue: FilterTypes;
  onClick: (value: FilterTypes) => void;
  value: FilterTypes;
  label: string;
}) => {
  const isSelected = value === currentValue;
  return (
    <DropdownMenuItem onClick={() => onClick(isSelected ? null : value)}>
      <div className="flex w-full items-center justify-between">
        <p>{label} </p>
        {isSelected && <Check className="h-4 w-4" />}
      </div>
    </DropdownMenuItem>
  );
};

export default FilterContextMenu;

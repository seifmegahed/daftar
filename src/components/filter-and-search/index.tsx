"use client";

import { useState } from "react";
import SearchBar from "@/components/search-bar";
import FilterBar from "./filter-bar";
import FilterContextMenu from "./context-menu";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

export const FILTER_VALUE = "fv";
export const FILTER_TYPE = "ft";

export type FilterTypes =
  | "status"
  | "type"
  | "owner"
  | "createdBy"
  | "startDate"
  | "endDate"
  | "creationDate"
  | "updateDate"
  | null;

export type FilterArgs = {
  filterType: FilterTypes;
  filterValue: string | null;
};

export const filterDefault: FilterArgs = {
  filterType: null,
  filterValue: null,
};

export type FilterOptionType = {
  label: string;
  value: FilterTypes;
  options?: { value: number; label: string }[];
};

const getFilterLabel = (
  filterItem: FilterTypes,
  filterItems: FilterOptionType[],
) => filterItems.find((x) => x.value === filterItem);

function FilterAndSearch({
  defaults,
  filterItems,
}: {
  defaults: FilterArgs;
  filterItems: FilterOptionType[];
}) {
  const [filterType, setFilterType] = useState<FilterTypes>(
    defaults.filterType,
  );
  const [filterLabel, setFilterLabel] = useState<string>("");

  const t = useTranslations("filter");

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <SearchBar />
        <FilterContextMenu
          value={filterType}
          onChange={(value) => {
            setFilterType(value);
            const item = getFilterLabel(value, filterItems);
            if (item) setFilterLabel(t("filter-by", { type: item.label }));
          }}
          filterItems={filterItems}
        />
      </div>
      {filterType && (
        <div className="flex flex-col gap-5 rounded-md border p-3 pb-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{filterLabel}</h1>
            <div
              className="flex size-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground"
              onClick={() => {
                setFilterType(null);
                setFilterLabel("");
              }}
            >
              <div>
                <X className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div>
            <FilterBar
              type={filterType}
              defaultValue={defaults.filterValue ?? undefined}
              options={
                filterItems.find((item) => item.value === filterType)?.options
              }
            />
          </div>
        </div>
      )}
    </>
  );
}

export default FilterAndSearch;

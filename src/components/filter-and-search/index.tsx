"use client";

import { useState } from "react";
import SearchBar from "@/components/search-bar";
import FilterBar from "./filter-bar";
import FilterContextMenu from "./context-menu";
import { X } from "lucide-react";

export const FILTER_VALUE = "fv";
export const FILTER_TYPE = "ft";

export type FilterTypes =
  | "status"
  | "startDate"
  | "endDate"
  | "creationDate"
  | "updateDate"
  | null;

function FilterAndSearch({
  defaults,
  filterItems,
}: {
  defaults: { filterType: FilterTypes; filterValue: string | null };
  filterItems: { label: string; value: FilterTypes }[];
}) {
  const [filterType, setFilterType] = useState<FilterTypes>(
    defaults.filterType,
  );
  return (
    <>
      <div className="flex justify-between">
        <SearchBar />
        <FilterContextMenu
          value={filterType}
          onChange={setFilterType}
          filterItems={filterItems}
        />
      </div>
      {filterType && (
        <div className="flex flex-col gap-5 rounded-md border p-3 pb-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{`Filter ${filterItems[filterItems.findIndex((v) => v.value === filterType)]?.label ?? ""}`}</h1>
            <div
              className="flex size-10 cursor-pointer items-center justify-center rounded-full text-muted-foreground"
              onClick={() => setFilterType(null)}
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
            />
          </div>
        </div>
      )}
    </>
  );
}

export default FilterAndSearch;

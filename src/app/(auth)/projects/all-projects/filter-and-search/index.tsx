"use client";

import { useState } from "react";
import SearchBar from "@/components/search-bar";
import FilterBar from "./filter-bar";
import FilterContextMenu from "./context-menu";

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
}: {
  defaults: { filterType: FilterTypes; filterValue: string | null };
}) {
  const [filterType, setFilterType] = useState<FilterTypes>(
    defaults.filterType,
  );
  return (
    <>
      <div className="flex justify-between">
        <SearchBar />
        <FilterContextMenu value={filterType} onChange={setFilterType} />
      </div>
      {/* <div className="flex justify-end"> */}
        <FilterBar
          type={filterType}
          defaultValue={defaults.filterValue ?? undefined}
        />
      {/* </div> */}
    </>
  );
}

export default FilterAndSearch;

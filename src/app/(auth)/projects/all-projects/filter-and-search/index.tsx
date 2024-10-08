"use client";

import { useState } from "react";
import SearchBar from "@/components/search-bar";
import FilterBar from "./filter-bar";
import FilterContextMenu from "./context-menu";
import { Button } from "@/components/ui/button";
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
      {filterType && (
        <div className="flex items-center justify-between">
          <FilterBar
            type={filterType}
            defaultValue={defaults.filterValue ?? undefined}
          />
          <Button
            variant="outline"
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground"
            onClick={() => setFilterType(null)}
          >
            <div>
              <X className="h-4 w-4" />
            </div>
          </Button>
        </div>
      )}
    </>
  );
}

export default FilterAndSearch;

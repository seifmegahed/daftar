import FilterAndSearch from "@/components/filter-and-search";
import type {
  FilterArgs,
  FilterOptionType,
} from "@/components/filter-and-search";
import type { ReactNode } from "react";

function ListPageWrapper({
  children,
  title,
  filter,
}: {
  children: ReactNode;
  title: string;
  filter?: { filterValues: FilterArgs; filterItems: FilterOptionType[] };
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-6 px-3 sm:px-0">
        <h3 className="text-lg font-medium">{title}</h3>
        {filter && (
          <FilterAndSearch
            defaults={filter.filterValues}
            filterItems={filter.filterItems}
          />
        )}
      </div>
      {children}
    </div>
  );
}

export default ListPageWrapper;

import FilterAndSearch from "@/components/filter-and-search";
import type {
  FilterArgs,
  FilterOptionType,
} from "@/components/filter-and-search";
import type { ReactNode } from "react";
import Pagination from "../pagination";

function ListPageWrapper({
  children,
  title,
  subtitle,
  filter,
  pagination,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  filter?: {
    filterValues: FilterArgs;
    filterItems: FilterOptionType[];
  };
  pagination?: { totalPages: number };
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-6 px-3 sm:px-0">
        <div className="">
          <h2 className="font-xl text-2xl font-bold" id="page-title">
            {title}
          </h2>
          {subtitle && <h3 className="text-muted-foreground">{subtitle}</h3>}
        </div>
        {filter && (
          <FilterAndSearch
            defaults={filter.filterValues}
            filterItems={filter.filterItems}
          />
        )}
      </div>
      <div className="space-y-0 sm:space-y-6">{children}</div>
      {pagination && (
        <div>
          <Pagination totalPages={pagination.totalPages} />
        </div>
      )}
    </div>
  );
}

export default ListPageWrapper;

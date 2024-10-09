import { Suspense } from "react";
import Pagination from "@/components/pagination";
import SuppliersList from "./all-suppliers/suppliers-list";
import { defaultPageLimit } from "@/data/config";
import { getSuppliersCountAction } from "@/server/actions/suppliers/read";
import SkeletonList from "@/components/skeletons";
import FilterAndSearch from "@/components/filter-and-search";

import type { SearchParamsPropsType } from "@/utils/type-utils";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

type Props = {
  searchParams: SearchParamsPropsType;
};

const filterItems: FilterOptionType[] = [
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function SuppliersPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [totalCount] = await getSuppliersCountAction(filterValues);

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Suppliers Page</h3>
      <FilterAndSearch
        filterItems={filterItems}
        defaults={filterValues}
      />
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <SuppliersList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default SuppliersPage;

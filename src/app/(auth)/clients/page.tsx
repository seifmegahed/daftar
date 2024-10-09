import { Suspense } from "react";
import Pagination from "@/components/pagination";
import ClientsList from "./all-clients/clients-list";
import { defaultPageLimit } from "@/data/config";
import { getClientsCountAction } from "@/server/actions/clients/read";
import FilterAndSearch from "@/components/filter-and-search";
import SkeletonList from "@/components/skeletons";
import type { FilterOptionType, FilterTypes } from "@/components/filter-and-search";
import type { SearchParamsPropsType } from "@/utils/type-utils";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

type Props = {
  searchParams: SearchParamsPropsType;
};

const projectFilterItems: FilterOptionType[] = [
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function ClientsPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [totalCount] = await getClientsCountAction(filterValues);

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Clients Page</h3>
      <FilterAndSearch
        defaults={filterValues}
        filterItems={projectFilterItems}
      />
      <Suspense key={page + query} fallback={<SkeletonList type="A" />}>
        <ClientsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default ClientsPage;

import { Suspense } from "react";
import Pagination from "@/components/pagination";

import { defaultPageLimit } from "@/data/config";
import { getClientsCountAction } from "@/server/actions/clients/read";
import FilterAndSearch from "@/components/filter-and-search";
import DocumentsList from "./all-documents/documents-list";
import SkeletonList from "@/components/skeletons";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import type { SearchParamsPropsType } from "@/utils/type-utils";

const pageLimit = defaultPageLimit;

type Props = {
  searchParams: SearchParamsPropsType;
};

const filterItems: FilterOptionType[] = [
  { label: "By Creation Date", value: "creationDate" },
];

async function DocumentsPage({ searchParams }: Props) {
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
      <h3 className="text-lg font-medium">All Documents Page</h3>
      <FilterAndSearch defaults={filterValues} filterItems={filterItems} />
      <Suspense key={page + query} fallback={<SkeletonList type="A" />}>
        <DocumentsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default DocumentsPage;

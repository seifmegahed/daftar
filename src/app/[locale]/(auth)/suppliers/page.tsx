import { Suspense } from "react";
import SuppliersList from "./all-suppliers/suppliers-list";
import { defaultPageLimit } from "@/data/config";
import { getSuppliersCountAction } from "@/server/actions/suppliers/read";
import SkeletonList from "@/components/skeletons";

import type { SearchParamsPropsType } from "@/utils/type-utils";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

const pageLimit = defaultPageLimit;

;

type Props = {
  searchParams: SearchParamsPropsType;
};

const filterItems: FilterOptionType[] = [
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function SuppliersPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? "1");
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [count, countError] = await getSuppliersCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  return (
    <ListPageWrapper
      title="All Suppliers Page"
      filter={{ filterItems, filterValues }}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <SuppliersList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
    </ListPageWrapper>
  );
}

export default SuppliersPage;

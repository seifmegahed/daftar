import { Suspense } from "react";

import { getClientsCountAction } from "@/server/actions/clients/read";

import DocumentsList from "./all-documents/documents-list";
import SkeletonList from "@/components/skeletons";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

import { defaultPageLimit } from "@/data/config";

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

  const [count, countError] = await getClientsCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  return (
    <ListPageWrapper
      title="All Documents Page"
      filter={{ filterValues, filterItems }}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="A" />}>
        <DocumentsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
    </ListPageWrapper>
  );
}

export default DocumentsPage;

import { Suspense } from "react";
import { defaultPageLimit } from "@/data/config";
import SkeletonList from "@/components/skeletons";
import ItemsList from "./all-items/items-list";
import { getItemsCountAction } from "@/server/actions/items/read";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

import type { SearchParamsPropsType } from "@/utils/type-utils";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";

const pageLimit = defaultPageLimit;

;

type Props = { searchParams: SearchParamsPropsType };

const filterItems: FilterOptionType[] = [
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function ItemsPage({ searchParams }: Props) {
  const pageParam = parseInt(searchParams.page ?? "1");
  const page = isNaN(pageParam) ? 1 : pageParam;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [count, countError] = await getItemsCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  return (
    <ListPageWrapper
      title="All Items Page"
      filter={{ filterItems, filterValues }}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <ItemsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
    </ListPageWrapper>
  );
}

export default ItemsPage;

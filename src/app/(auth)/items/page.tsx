import { Suspense } from "react";
import { defaultPageLimit } from "@/data/config";
import SkeletonList from "@/components/skeletons";
import ItemsList from "./all-items/items-list";
import { getItemsCountAction } from "@/server/actions/items/read";
import type { SearchParamsPropsType } from "@/utils/type-utils";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import ListPageWrapper from "@/components/list-page-wrapper";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

type Props = { searchParams: SearchParamsPropsType };

const filterItems: FilterOptionType[] = [
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function ItemsPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [totalCount] = await getItemsCountAction(filterValues);

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

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

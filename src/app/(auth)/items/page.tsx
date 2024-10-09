import { Suspense } from "react";
import Pagination from "@/components/pagination";
import { defaultPageLimit } from "@/data/config";
import SkeletonList from "@/components/skeletons";
import ItemsList from "./all-items/items-list";
import { getItemsCountAction } from "@/server/actions/items/read";
import type { SearchParamsPropsType } from "@/utils/type-utils";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import FilterAndSearch from "@/components/filter-and-search";

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
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Items Page</h3>
      <FilterAndSearch filterItems={filterItems} defaults={filterValues} />
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <ItemsList page={page} query={query === "" ? undefined : query} filter={filterValues} />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default ItemsPage;

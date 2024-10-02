import { Suspense } from "react";
import Pagination from "@/components/pagination";
import { defaultPageLimit } from "@/data/config";
import SkeletonList from "@/components/skeletons";
import ItemsList from "./all-items/items-list";
import FilterAndSearch from "./all-items/filter-and-search";
import { getItemsCountAction } from "@/server/actions/items";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

async function ItemsPage({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const [totalCount] = await getItemsCountAction();

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Items Page</h3>
      <FilterAndSearch />
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <ItemsList page={page} query={query === "" ? undefined : query} />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default ItemsPage;

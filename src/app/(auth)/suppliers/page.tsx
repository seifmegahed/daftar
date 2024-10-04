import { Suspense } from "react";
import Pagination from "@/components/pagination";
import SuppliersList from "./all-suppliers/suppliers-list";
import { defaultPageLimit } from "@/data/config";
import { getSuppliersCountAction } from "@/server/actions/suppliers/read";
import FilterAndSearch from "./all-suppliers/filter-and-search";
import SkeletonList from "@/components/skeletons";


const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

async function SuppliersPage({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const [totalCount] = await getSuppliersCountAction();

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Suppliers Page</h3>
      <FilterAndSearch />
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <SuppliersList page={page} query={query === "" ? undefined : query} />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default SuppliersPage;

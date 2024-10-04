import { Suspense } from "react";
import Pagination from "@/components/pagination";
import ClientsList from "./all-clients/clients-list";
import { defaultPageLimit } from "@/data/config";
import { getClientsCountAction } from "@/server/actions/clients/read";
import FilterAndSearch from "./all-clients/filter-and-search";
import SkeletonList from "@/components/skeletons";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

async function ClientsPage({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const [totalCount] = await getClientsCountAction();

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Clients Page</h3>
      <FilterAndSearch />
      <Suspense key={page + query} fallback={<SkeletonList type="A" />}>
        <ClientsList page={page} query={query === "" ? undefined : query} />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default ClientsPage;

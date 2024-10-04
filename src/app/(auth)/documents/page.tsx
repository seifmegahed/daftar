import { Suspense } from "react";
import Pagination from "@/components/pagination";

import { defaultPageLimit } from "@/data/config";
import { getClientsCountAction } from "@/server/actions/clients/read";
import FilterAndSearch from "./all-documents/filter-and-search";
import DocumentsList from "./all-documents/documents-list";
import SkeletonList from "@/components/skeletons";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

async function DocumentsPage({
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
      <h3 className="text-lg font-medium">All Documents Page</h3>
      <FilterAndSearch />
      <Suspense key={page + query} fallback={<SkeletonList type="A" />}>
        <DocumentsList page={page} query={query === "" ? undefined : query} />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default DocumentsPage;

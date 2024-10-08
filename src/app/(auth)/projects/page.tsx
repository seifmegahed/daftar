import { Suspense } from "react";
import Pagination from "@/components/pagination";
import ProjectsList from "./all-projects/projects-list";
import FilterAndSearch from "./all-projects/filter-and-search";
import type { FilterTypes } from "./all-projects/filter-and-search";
import SkeletonList from "@/components/skeletons";
import { getProjectsCountAction } from "@/server/actions/projects/read";
import { defaultPageLimit } from "@/data/config";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

type Props = {
  searchParams: {
    page?: string;
    query?: string;
    ft?: string;
    fv?: string;
  };
};

async function AllProjects({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [totalCount] = await getProjectsCountAction();

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Projects Page</h3>
      <FilterAndSearch defaults={filterValues} />
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <ProjectsList page={page} query={query === "" ? undefined : query} filter={filterValues} />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default AllProjects;

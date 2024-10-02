import { Suspense } from "react";
import Pagination from "@/components/pagination";
import ProjectsList from "./all-projects/projects-list";
import SearchBar from "./all-projects/filter-and-search";
import SkeletonList from "./all-projects/project-list-skeleton";
import { getProjectsCountAction } from "@/server/actions/projects";
import { defaultPageLimit } from "@/data/config";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

async function AllProjects({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const [totalCount] = await getProjectsCountAction();

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Projects Page</h3>
      <SearchBar />
      <Suspense key={page + query} fallback={<SkeletonList />}>
        <ProjectsList page={page} query={query === "" ? undefined : query} />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default AllProjects;

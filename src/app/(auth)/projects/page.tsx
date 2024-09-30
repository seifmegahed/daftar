import { Suspense } from "react";
import Pagination from "./all-projects/pagination";
import ProjectsList from "./all-projects/projects-list";
import SearchBar from "./all-projects/search-bar";
import SkeletonList from "./all-projects/project-list-skeleton";

function AllProjects({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const totalPages = 6;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Projects Page</h3>
      <SearchBar />
      <Suspense key={page + query} fallback={<SkeletonList />}>
        <ProjectsList page={page} query={query === "" ? undefined : query} />
      </Suspense>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

export default AllProjects;

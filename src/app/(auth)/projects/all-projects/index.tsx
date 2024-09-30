import { Suspense } from "react";
import Pagination from "./pagination";
import ProjectsList from "./projects-list";
import SearchBar from "./search-bar";
import SkeletonList from "./project-list-skeleton";

function AllProjects({ page }: { page: number }) {
  const totalPages = 6;
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Projects Page</h3>
      <SearchBar />

      <Suspense fallback={<SkeletonList />}>
        <ProjectsList page={page} />
      </Suspense>
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

export default AllProjects;

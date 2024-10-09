import { Suspense } from "react";
import Pagination from "@/components/pagination";
import ProjectsList from "./all-projects/projects-list";
import FilterAndSearch from "@/components/filter-and-search";
import type { FilterOptionType, FilterTypes } from "@/components/filter-and-search";
import SkeletonList from "@/components/skeletons";
import { getProjectsCountAction } from "@/server/actions/projects/read";
import { defaultPageLimit } from "@/data/config";
import type { SearchParamsPropsType } from "@/utils/type-utils";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

type Props = {
  searchParams: SearchParamsPropsType;
};

const projectFilterItems: FilterOptionType[] = [
  { label: "By Status", value: "status" },
  { label: "By Start Date", value: "startDate" },
  { label: "By End Date", value: "endDate" },
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function AllProjects({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [totalCount] = await getProjectsCountAction(filterValues);

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">All Projects Page</h3>
      <FilterAndSearch
        defaults={filterValues}
        filterItems={projectFilterItems}
      />
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <ProjectsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
      <Pagination totalPages={totalPages === 0 ? 1 : totalPages} />
    </div>
  );
}

export default AllProjects;

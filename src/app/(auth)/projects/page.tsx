import { Suspense } from "react";
import ProjectsList from "./all-projects/projects-list";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import SkeletonList from "@/components/skeletons";
import { getProjectsCountAction } from "@/server/actions/projects/read";
import { defaultPageLimit } from "@/data/config";
import type { SearchParamsPropsType } from "@/utils/type-utils";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { format } from "date-fns";

const pageLimit = defaultPageLimit;

type Props = {
  searchParams: SearchParamsPropsType;
};

const filterItems: FilterOptionType[] = [
  { label: "By Status", value: "status" },
  { label: "By Start Date", value: "startDate" },
  { label: "By End Date", value: "endDate" },
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function AllProjects({ searchParams }: Props) {
  const time = new Date(Date.now() + 1000 * 60 * 60 * 2);
  const parsedPage = parseInt(searchParams.page ?? "1");
  const page = isNaN(parsedPage) ? 1 : parsedPage;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [count, countError] =
    await getProjectsCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil((count) / pageLimit);

  return (
    <ListPageWrapper
      title="All Project Page"
      filter={{ filterItems, filterValues }}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <div>{format(time, "pp")}</div>
        <ProjectsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
    </ListPageWrapper>
  );
}

export default AllProjects;

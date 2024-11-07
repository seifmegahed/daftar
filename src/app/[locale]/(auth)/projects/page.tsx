import { Suspense } from "react";
import ProjectsList from "./all-projects/projects-list";
import SkeletonList from "@/components/skeletons";
import { getProjectsCountAction } from "@/server/actions/projects/read";
import { defaultPageLimit } from "@/data/config";
import { getTranslations } from "next-intl/server";

import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

import type { SearchParamsPropsType } from "@/utils/type-utils";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import { setLocale, type LocaleParams } from "@/i18n/set-locale";
import { listAllUsersAction } from "@/server/actions/users";

const pageLimit = defaultPageLimit;

type Props = {
  searchParams: SearchParamsPropsType;
  params: LocaleParams;
};

async function AllProjects({ searchParams, params }: Props) {
  setLocale(params.locale);

  const parsedPage = parseInt(searchParams.page ?? "1");
  const page = isNaN(parsedPage) ? 1 : parsedPage;
  const query = searchParams.query ?? "";
  const t = await getTranslations("projects.page");

  const [users] = await listAllUsersAction();

  const userOptions = users?.map((user) => ({
    label: user.name,
    value: user.id,
  }));

  const filterItems: FilterOptionType[] = [
    {
      label: t("filter-by-status"),
      value: "status",
    },
    {
      label: t("filter-by-type"),
      value: "type",
    },
    {
      label: t("filter-by-owner"),
      value: "owner",
      options: userOptions,
    },
    {
      label: t("filter-by-created-by"),
      value: "createdBy",
      options: userOptions,
    },
    {
      label: t("filter-by-start-date"),
      value: "startDate",
    },
    {
      label: t("filter-by-end-date"),
      value: "endDate",
    },
    {
      label: t("filter-by-creation-date"),
      value: "creationDate",
    },
    {
      label: t("filter-by-update-date"),
      value: "updateDate",
    },
  ];

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [count, countError] = await getProjectsCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  return (
    <ListPageWrapper
      title={t("title")}
      filter={{ filterItems, filterValues }}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
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

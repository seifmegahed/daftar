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

const pageLimit = defaultPageLimit;

type Props = {
  searchParams: SearchParamsPropsType;
  params: LocaleParams;
};

const filterItems: FilterOptionType[] = [
  {
    label: "By Status",
    value: "status",
    locale: { en: "By Status", ar: "بالحالة" },
  },
  { label: "By Type", value: "type", locale: { en: "By Type", ar: "بالنوع" } },
  {
    label: "By Start Date",
    value: "startDate",
    locale: { en: "By Start Date", ar: "بتاريخ البدء" },
  },
  {
    label: "By End Date",
    value: "endDate",
    locale: { en: "By End Date", ar: "بتاريخ الانتهاء" },
  },
  {
    label: "By Creation Date",
    value: "creationDate",
    locale: { en: "By Creation Date", ar: "بتاريخ الإنشاء" },
  },
  {
    label: "By Update Date",
    value: "updateDate",
    locale: { en: "By Update Date", ar: "بتاريخ التحديث" },
  },
];

async function AllProjects({ searchParams, params }: Props) {
  setLocale(params.locale);

  const parsedPage = parseInt(searchParams.page ?? "1");
  const page = isNaN(parsedPage) ? 1 : parsedPage;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [count, countError] = await getProjectsCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  const t = await getTranslations("projects.all-projects-page");

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

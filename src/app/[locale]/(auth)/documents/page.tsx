import { Suspense } from "react";

import { getClientsCountAction } from "@/server/actions/clients/read";

import DocumentsList from "./all-documents/documents-list";
import SkeletonList from "@/components/skeletons";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

import { defaultPageLimit } from "@/data/config";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import type { SearchParamsPropsType } from "@/utils/type-utils";

const pageLimit = defaultPageLimit;

type Props = {
  searchParams: SearchParamsPropsType;
  params: { locale: Locale };
};

async function DocumentsPage({ searchParams, params }: Props) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("documents.page");

  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const filterItems: FilterOptionType[] = [
    { label: t("filter-by-creation-date"), value: "creationDate" },
  ];

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [count, countError] = await getClientsCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  return (
    <ListPageWrapper
      title={t("title")}
      filter={{ filterValues, filterItems }}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="A" />}>
        <DocumentsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
    </ListPageWrapper>
  );
}

export default DocumentsPage;

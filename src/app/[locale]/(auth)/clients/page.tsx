import { Suspense } from "react";
import ClientsList from "./all-clients/clients-list";
import { defaultPageLimit } from "@/data/config";
import { getClientsCountAction } from "@/server/actions/clients/read";
import SkeletonList from "@/components/skeletons";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import type { SearchParamsPropsType } from "@/utils/type-utils";
import type { LocaleParams } from "@/i18n/set-locale";

const pageLimit = defaultPageLimit;

type Props = {
  params: LocaleParams
  searchParams: SearchParamsPropsType;
};


async function ClientsPage({ searchParams, params }: Props) {
  const { locale } = params;
  setLocale(locale);
  const t = await getTranslations("clients.page");

  const pageParam = parseInt(searchParams.page ?? "1");
  const page = isNaN(pageParam) ? 1 : pageParam;
  const query = searchParams.query ?? "";
  
  const filterItems: FilterOptionType[] = [
    { label: t("filter-by-creation-date"), value: "creationDate" },
    { label: t("filter-by-updated-date"), value: "updateDate" },
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
      filter={{ filterItems, filterValues }}
      title={t("title")}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="A" />}>
        <ClientsList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
    </ListPageWrapper>
  );
}

export default ClientsPage;

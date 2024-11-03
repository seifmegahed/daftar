import { Suspense } from "react";

import SuppliersList from "./all-suppliers/suppliers-list";
import { defaultPageLimit } from "@/data/config";
import { getSuppliersCountAction } from "@/server/actions/suppliers/read";
import SkeletonList from "@/components/skeletons";
import ListPageWrapper from "@/components/list-page-wrapper";
import ErrorPage from "@/components/error";

import type { SearchParamsPropsType } from "@/utils/type-utils";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import { setLocale } from "@/i18n/set-locale";
import { getTranslations } from "next-intl/server";

const pageLimit = defaultPageLimit;

type Props = {
  params: { locale: Locale };
  searchParams: SearchParamsPropsType;
};

async function SuppliersPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page ?? "1");
  const query = searchParams.query ?? "";
  setLocale(params.locale);
  const t = await getTranslations("suppliers.page");

  const filterItems: FilterOptionType[] = [
    { label: t("filter-by-creation-date"), value: "creationDate" },
    { label: t("filter-by-updated-date"), value: "updateDate" },
  ];

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [count, countError] = await getSuppliersCountAction(filterValues);
  if (countError !== null) return <ErrorPage message={countError} />;

  const totalPages = Math.ceil(count / pageLimit);

  return (
    <ListPageWrapper
      title={t("title")}
      filter={{ filterItems, filterValues }}
      pagination={{ totalPages }}
    >
      <Suspense key={page + query} fallback={<SkeletonList type="B" />}>
        <SuppliersList
          page={page}
          query={query === "" ? undefined : query}
          filter={filterValues}
        />
      </Suspense>
    </ListPageWrapper>
  );
}

export default SuppliersPage;

import { Suspense } from "react";
import ClientsList from "./all-clients/clients-list";
import { defaultPageLimit } from "@/data/config";
import { getClientsCountAction } from "@/server/actions/clients/read";
import SkeletonList from "@/components/skeletons";
import type {
  FilterOptionType,
  FilterTypes,
} from "@/components/filter-and-search";
import type { SearchParamsPropsType } from "@/utils/type-utils";
import ListPageWrapper from "@/components/list-page-wrapper";

const pageLimit = defaultPageLimit;

export const dynamic = "force-dynamic";

type Props = {
  searchParams: SearchParamsPropsType;
};

const filterItems: FilterOptionType[] = [
  { label: "By Creation Date", value: "creationDate" },
  { label: "By Update Date", value: "updateDate" },
];

async function ClientsPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const query = searchParams.query ?? "";

  const filterValues = {
    filterType: (searchParams.ft as FilterTypes) ?? null,
    filterValue: searchParams.fv ?? "",
  };

  const [totalCount] = await getClientsCountAction(filterValues);

  const totalPages = Math.ceil((totalCount ?? 1) / pageLimit);

  return (
    <ListPageWrapper
      filter={{ filterItems, filterValues }}
      title="All Clients Page"
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

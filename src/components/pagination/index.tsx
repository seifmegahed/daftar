"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import PaginationWrapper from "./wrapper";
import Selector from "./selector";

function Pagination({
  totalPages,
  numberOfElements = 3,
}: {
  totalPages: number;
  numberOfElements?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <PaginationWrapper>
      <Selector
        currentPage={currentPage}
        totalPages={totalPages}
        numberOfElements={numberOfElements}
        handleClick={(page) => router.replace(createPageUrl(page))}
      />
    </PaginationWrapper>
  );
}

export default Pagination;

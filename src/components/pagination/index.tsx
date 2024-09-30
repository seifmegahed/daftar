"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import PaginationWrapper from "./wrapper";
import Selector from "./selector";

function Pagination({ totalPages }: { totalPages: number }) {
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
    <PaginationWrapper
      currentPage={currentPage}
      totalPages={totalPages}
      handleClick={(page) => router.replace(createPageUrl(page))}
    >
      <Selector
        currentPage={currentPage}
        totalPages={totalPages}
        handleClick={(page) => router.replace(createPageUrl(page))}
      />
    </PaginationWrapper>
  );
}

export default Pagination;
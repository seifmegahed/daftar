"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const Pagination = ({ totalPages }: { totalPages: number }) => {
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
    <div className="flex justify-between">
      <Button
        className="w-32"
        disabled={currentPage === 1}
        onClick={() => router.replace(createPageUrl(currentPage - 1))}
      >
        Previous
      </Button>
      <div className="flex w-full items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <Button
        className="w-32"
        disabled={currentPage === totalPages}
        onClick={() => router.replace(createPageUrl(currentPage + 1))}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;

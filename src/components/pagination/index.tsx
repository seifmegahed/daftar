"use client";

import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const numberOfElements = 3;
  const ceiledPage = Math.ceil(numberOfElements / 2);
  const flooredPage = Math.floor(numberOfElements / 2);

  if (totalPages <= numberOfElements)
    return (
      <div className="flex items-center justify-center">
        <div className="flex justify-between gap-4">
          <Button
            className="flex size-10 items-center justify-center rounded-full"
            disabled={currentPage === 1}
            onClick={() => router.replace(createPageUrl(currentPage - 1))}
          >
            <div>
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PageButton
              key={i}
              page={i + 1}
              disabled={currentPage === i + 1}
              onClick={() => router.replace(createPageUrl(i + 1))}
            />
          ))}
          <Button
            className="flex size-10 items-center justify-center rounded-full"
            disabled={currentPage === totalPages}
            onClick={() => router.replace(createPageUrl(currentPage + 1))}
          >
            <div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>
    );

  // Start
  if (currentPage <= ceiledPage) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex justify-between gap-4">
          {currentPage !== 1 && (
            <Button
              className="flex size-10 items-center justify-center rounded-full"
              disabled={currentPage === 1}
              onClick={() => router.replace(createPageUrl(currentPage - 1))}
            >
              <div>
                <ChevronLeft className="h-4 w-4" />
              </div>
            </Button>
          )}
          {Array.from({ length: numberOfElements }).map((_, i) => (
            <PageButton
              key={i}
              page={i + 1}
              disabled={currentPage === i + 1}
              onClick={() => router.replace(createPageUrl(i + 1))}
            />
          ))}
          <div className="flex size-10 items-center justify-center rounded-full">
            <DotsHorizontalIcon />
          </div>
          <PageButton
            page={totalPages}
            onClick={() => router.replace(createPageUrl(totalPages))}
          />
          <Button
            className="flex size-10 items-center justify-center rounded-full"
            disabled={currentPage === totalPages}
            onClick={() => router.replace(createPageUrl(currentPage + 1))}
          >
            <div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>
    );
  }
  // End
  if (currentPage + flooredPage >= totalPages) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex justify-between gap-4">
          <Button
            className="flex size-10 items-center justify-center rounded-full"
            disabled={currentPage === 1}
            onClick={() => router.replace(createPageUrl(currentPage - 1))}
          >
            <div>
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Button>
          <PageButton
            page={1}
            onClick={() => router.replace(createPageUrl(1))}
          />
          <div className="flex size-10 items-center justify-center rounded-full">
            <DotsHorizontalIcon />
          </div>
          {Array.from({ length: numberOfElements }).map((_, i) => (
            <PageButton
              key={i}
              page={i + totalPages - numberOfElements + 1}
              disabled={currentPage === i + totalPages - numberOfElements + 1}
              onClick={() =>
                router.replace(
                  createPageUrl(i + totalPages - numberOfElements + 1),
                )
              }
            />
          ))}
          {currentPage !== totalPages && (
            <Button
              className="flex size-10 items-center justify-center rounded-full"
              disabled={currentPage === totalPages}
              onClick={() => router.replace(createPageUrl(currentPage + 1))}
            >
              <div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Between
  return (
    <div className="flex items-center justify-center">
      <div className="flex justify-between gap-4">
        <Button
          className="flex size-10 items-center justify-center rounded-full"
          disabled={currentPage === 1}
          onClick={() => router.replace(createPageUrl(currentPage - 1))}
        >
          <div>
            <ChevronLeft className="h-4 w-4" />
          </div>
        </Button>
        <PageButton page={1} onClick={() => router.replace(createPageUrl(1))} />
        {currentPage !== numberOfElements && (
          <div className="flex size-10 items-center justify-center rounded-full">
            <DotsHorizontalIcon />
          </div>
        )}
        {Array.from({ length: numberOfElements }).map((_, i) => (
          <PageButton
            key={i}
            page={i + currentPage - flooredPage}
            disabled={currentPage === i + currentPage - flooredPage}
            onClick={() =>
              router.replace(createPageUrl(i + currentPage - flooredPage))
            }
          />
        ))}
        {currentPage - flooredPage + numberOfElements !== totalPages && (
          <div className="flex size-10 items-center justify-center rounded-full">
            <DotsHorizontalIcon />
          </div>
        )}
        <PageButton
          page={totalPages}
          onClick={() => router.replace(createPageUrl(totalPages))}
        />
        <Button
          className="flex size-10 items-center justify-center rounded-full"
          disabled={currentPage === totalPages}
          onClick={() => router.replace(createPageUrl(currentPage + 1))}
        >
          <div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Button>
      </div>
    </div>
  );
};

const PageButton = ({
  page,
  disabled,
  onClick,
}: {
  page: number;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full transition-all duration-500 ease-in-out hover:scale-110"
    >
      <div>{page}</div>
    </Button>
  );
};

export default Pagination;

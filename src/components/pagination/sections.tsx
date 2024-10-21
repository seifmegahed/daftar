import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import PaginationButton from "./pagination-button";

export const PaginationFull = ({
  currentPage,
  totalPages,
  handleClick,
}: {
  currentPage: number;
  totalPages: number;
  handleClick: (page: number) => void;
}) => (
  <>
    {Array.from({ length: totalPages }).map((_, i) => (
      <PaginationButton
        key={i}
        page={i + 1}
        disabled={currentPage === i + 1}
        onClick={() => handleClick(i + 1)}
      />
    ))}
  </>
);

export const PaginationStart = ({
  currentPage,
  totalPages,
  numberOfElements,
  handleClick,
}: {
  currentPage: number;
  totalPages: number;
  numberOfElements: number;
  handleClick: (page: number) => void;
}) => (
  <>
    {Array.from({ length: numberOfElements + 2 }).map((_, i) => (
      <PaginationButton
        key={i}
        page={i + 1}
        disabled={currentPage === i + 1}
        onClick={() => handleClick(i + 1)}
      />
    ))}
    <div className="flex size-10 items-center justify-center rounded-full">
      <DotsHorizontalIcon />
    </div>
    <PaginationButton
      page={totalPages}
      onClick={() => handleClick(totalPages)}
    />
  </>
);

export const PaginationBetween = ({
  currentPage,
  numberOfElements,
  totalPages,
  flooredPage,
  handleClick,
}: {
  currentPage: number;
  numberOfElements: number;
  totalPages: number;
  flooredPage: number;
  handleClick: (page: number) => void;
}) => {
  return (
    <>
      <PaginationButton page={1} onClick={() => handleClick(1)} />
      {currentPage !== numberOfElements && (
        <div className="flex size-10 items-center justify-center rounded-full">
          <DotsHorizontalIcon />
        </div>
      )}
      {Array.from({ length: numberOfElements }).map((_, i) => (
        <PaginationButton
          key={i}
          page={i + currentPage - flooredPage}
          disabled={currentPage === i + currentPage - flooredPage}
          onClick={() => handleClick(i + currentPage - flooredPage)}
        />
      ))}
      {currentPage - flooredPage + numberOfElements !== totalPages && (
        <div className="flex size-10 items-center justify-center rounded-full">
          <DotsHorizontalIcon />
        </div>
      )}
      <PaginationButton
        page={totalPages}
        onClick={() => handleClick(totalPages)}
      />
    </>
  );
};

export const PaginationEnd = ({
  currentPage,
  totalPages,
  numberOfElements,
  handleClick,
}: {
  currentPage: number;
  totalPages: number;
  numberOfElements: number;
  handleClick: (page: number) => void;
}) => (
  <>
    <PaginationButton page={1} onClick={() => handleClick(1)} />
    {currentPage !== numberOfElements && (
      <div className="flex size-10 items-center justify-center rounded-full">
        <DotsHorizontalIcon />
      </div>
    )}
    {Array.from({ length: numberOfElements + 2 }).map((_, i) => (
      <PaginationButton
        key={i - 2}
        page={i + totalPages - numberOfElements - 1}
        disabled={currentPage === i + totalPages - numberOfElements - 1}
        onClick={() => handleClick(i + totalPages - numberOfElements - 1)}
      />
    ))}
  </>
);

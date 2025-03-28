import {
  PaginationBetween,
  PaginationEnd,
  PaginationFull,
  PaginationStart,
} from "./sections";

const Selector = ({
  currentPage,
  totalPages,
  numberOfElements,
  handleClick,
}: {
  currentPage: number;
  totalPages: number;
  numberOfElements: number;
  handleClick: (page: number) => void;
}) => {
  const ceiledPage = Math.ceil(numberOfElements / 2);
  const flooredPage = Math.floor(numberOfElements / 2);

  // None
  if (totalPages <= 1) return null;

  // Full
  if (totalPages <= numberOfElements + 2)
    return (
      <PaginationFull
        currentPage={currentPage}
        totalPages={totalPages}
        handleClick={handleClick}
      />
    );

  // Start
  if (currentPage <= ceiledPage + 1) {
    return (
      <PaginationStart
        currentPage={currentPage}
        totalPages={totalPages}
        numberOfElements={numberOfElements}
        handleClick={handleClick}
      />
    );
  }

  // End
  if (currentPage + flooredPage >= totalPages - 1) {
    return (
      <PaginationEnd
        currentPage={currentPage}
        totalPages={totalPages}
        numberOfElements={numberOfElements}
        handleClick={handleClick}
      />
    );
  }

  // Between
  return (
    <PaginationBetween
      currentPage={currentPage}
      totalPages={totalPages}
      numberOfElements={numberOfElements}
      flooredPage={flooredPage}
      handleClick={handleClick}
    />
  );
};

export default Selector;

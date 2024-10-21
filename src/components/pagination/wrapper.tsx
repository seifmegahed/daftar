import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaginationWrapper = ({
  currentPage,
  totalPages,
  handleClick,
  children,
}: {
  currentPage: number;
  totalPages: number;
  handleClick: (page: number) => void;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-center">
    <div className="flex justify-between gap-2 sm:gap-4">
      {currentPage !== 1 && (
        <Button
          className="hidden size-10 items-center justify-center rounded-full sm:flex"
          disabled={currentPage === 1}
          onClick={() => handleClick(currentPage - 1)}
        >
          <div>
            <ChevronLeft className="h-4 w-4" />
          </div>
        </Button>
      )}
      {children}
      {currentPage !== totalPages && totalPages > 1 && (
        <Button
          className="hidden size-10 items-center justify-center rounded-full sm:flex"
          disabled={currentPage === totalPages}
          onClick={() => handleClick(currentPage + 1)}
        >
          <div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </Button>
      )}
    </div>
  </div>
);

export default PaginationWrapper;

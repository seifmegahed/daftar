import { Skeleton } from "@/components/ui/skeleton";
import ListPageWrapperSkeleton from "./list-page-wrapper-skeleton";

function AltDocumentCardSkeleton() {
  return (
    <div className="flex justify-between sm:ps-5 sm:px-0 px-3">
      <div className="flex items-center gap-x-4">
        <Skeleton className="h-8 w-7" />
        <Skeleton className="h-[1.2rem] w-[15rem]" />
      </div>
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  );
}

function AltDocumentsListSkeleton() {
  return (
    <ListPageWrapperSkeleton subtitle>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <AltDocumentCardSkeleton key={i} />
        ))}
      </div>
    </ListPageWrapperSkeleton>
  );
}

export default AltDocumentsListSkeleton;

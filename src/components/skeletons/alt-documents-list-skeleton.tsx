import InfoPageSkeletonWrapper from "@/components/skeletons/info-page-wrapper-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function AltDocumentCardSkeleton() {
  return (
    <div className="flex justify-between pl-5">
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
    <InfoPageSkeletonWrapper>
      <div className="flex flex-col gap-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <AltDocumentCardSkeleton key={i} />
        ))}
      </div>
    </InfoPageSkeletonWrapper>
  );
}

export default AltDocumentsListSkeleton;

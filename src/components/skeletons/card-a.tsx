import { Skeleton } from "@/components/ui/skeleton";
import CardWrapper from "../card-wrapper";

export const SkeletonCardA = () => {
  return (
    <CardWrapper>
      <Skeleton className="hidden h-8 w-14 sm:block" />
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <Skeleton className="h-8 w-1/2 sm:-ml-1" />
        <div className="flex flex-col gap-2 sm:items-end">
          <Skeleton className="h-[1.2rem] w-2/3" />
          <Skeleton className="h-[0.8rem] w-1/3" />
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </CardWrapper>
  );
};

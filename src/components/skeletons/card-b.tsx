import CardWrapper from "../card-wrapper";
import { Skeleton } from "../ui/skeleton";

export const SkeletonCardB = () => {
  return (
    <CardWrapper>
      <Skeleton className="ms-1 hidden h-8 w-10 sm:block" />
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1.2rem] w-[15rem]" />
          <Skeleton className="h-[0.8rem] w-[12rem]" />
        </div>
        <div className="flex w-36 flex-col gap-2 sm:items-end">
          <Skeleton className="h-[1.2rem] w-[10rem]" />
          <Skeleton className="h-[0.8rem] w-[7rem]" />
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </CardWrapper>
  );
};

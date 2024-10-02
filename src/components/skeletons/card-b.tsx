import { Skeleton } from "../ui/skeleton";

export const SkeletonCardB = () => {
  return (
    <div className="flex items-center gap-5 rounded-xl border p-4">
      <Skeleton className="ml-1 h-8 w-10" />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1.2rem] w-[15rem]" />
          <Skeleton className="h-[0.8rem] w-[12rem]" />
        </div>
        <div className="flex w-36 flex-col items-end gap-2">
          <Skeleton className="h-[1.2rem] w-[10rem]" />
          <Skeleton className="h-[0.8rem] w-[7rem]" />
        </div>
      </div>
      <Skeleton className="h-7 w-8 rounded-full" />
    </div>
  );
};

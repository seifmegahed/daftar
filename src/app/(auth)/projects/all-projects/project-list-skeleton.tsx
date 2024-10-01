import { Skeleton } from "@/components/ui/skeleton";

function SkeletonList({ pageLimit = 10 }: { pageLimit?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: pageLimit }).map((_, i) => (
        <SkeletonCard key={"skeleton-card-" + i} />
      ))}
    </div>
  );
}

const SkeletonCard = () => {
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
      <Skeleton className="w-8 h-7 rounded-full" />
    </div>
  );
};

export default SkeletonList;

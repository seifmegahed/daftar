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
    <div className="flex cursor-pointer items-center gap-5 rounded-xl border p-4 hover:bg-muted">
      <Skeleton className="h-8 w-8" />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1.2rem] w-[15rem]" />
          <Skeleton className="h-[0.8rem] w-[12rem]" />
        </div>
        <div className="w-36 flex flex-col gap-2 items-end">
          <Skeleton className="h-[1.2rem] w-[10rem]" />
          <Skeleton className="h-[0.8rem] w-[7rem]" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonList;

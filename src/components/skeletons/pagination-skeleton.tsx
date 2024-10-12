import { Skeleton } from "@/components/ui/skeleton";

function PaginationSkeleton() {
  return (
    <div className="flex justify-center gap-4 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="size-10 rounded-full" />
      ))}
    </div>
  );
}

export default PaginationSkeleton;

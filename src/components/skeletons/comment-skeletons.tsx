import { Skeleton } from "@/components/ui/skeleton";

function CommentCardSkeleton() {
  return (
    <div className="flex w-full gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-[5.5rem] w-full rounded-lg" />
    </div>
  );
}

export function CommentsListSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CommentCardSkeleton key={i} />
      ))}
    </div>
  );
}

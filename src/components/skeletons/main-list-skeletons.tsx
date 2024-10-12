import { SkeletonCardA } from "@/components/skeletons/card-a";
import PaginationSkeleton from "@/components/skeletons/pagination-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { SkeletonCardB } from "./card-b";

function MainListWrapperSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[2rem] w-40" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-[2rem] w-[300px]" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      {children}
      <PaginationSkeleton />
    </div>
  );
}
export function CardAMainListSkeleton() {
  return (
    <MainListWrapperSkeleton>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCardA key={i} />
      ))}
    </MainListWrapperSkeleton>
  );
}

export function CardBMainListSkeleton() {
  return (
    <MainListWrapperSkeleton>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCardB key={i} />
      ))}
    </MainListWrapperSkeleton>
  );
}

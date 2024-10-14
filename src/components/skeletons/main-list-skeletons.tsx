import { SkeletonCardA } from "@/components/skeletons/card-a";
import { SkeletonCardB } from "./card-b";
import ListPageWrapperSkeleton from "./list-page-wrapper-skeleton";
import PaginationSkeleton from "./pagination-skeleton";

export function CardAMainListSkeleton() {
  return (
    <ListPageWrapperSkeleton filter>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCardA key={i} />
      ))}
      <PaginationSkeleton />
    </ListPageWrapperSkeleton>
  );
}

export function CardBMainListSkeleton() {
  return (
    <ListPageWrapperSkeleton filter>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCardB key={i} />
      ))}
      <PaginationSkeleton />
    </ListPageWrapperSkeleton>
  );
}

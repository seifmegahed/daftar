import { SkeletonCardA } from "@/components/skeletons/card-a";
import { SkeletonCardB } from "./card-b";
import ListPageWrapperSkeleton from "./list-page-wrapper-skeleton";

export function CardAMainListSkeleton() {
  return (
    <ListPageWrapperSkeleton filter pagination>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCardA key={i} />
      ))}
    </ListPageWrapperSkeleton>
  );
}

export function CardBMainListSkeleton() {
  return (
    <ListPageWrapperSkeleton filter pagination>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCardB key={i} />
      ))}
    </ListPageWrapperSkeleton>
  );
}

import { SkeletonCardA } from "./card-a";
import { SkeletonCardB } from "./card-b";
import ListPageWrapperSkeleton from "./list-page-wrapper-skeleton";

export function CardBAltListSkeleton() {
  return (
    <ListPageWrapperSkeleton subtitle>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCardB key={i} />
        ))}
      </div>
    </ListPageWrapperSkeleton>
  );
}

export function CardAAltListSkeleton() {
  return (
    <ListPageWrapperSkeleton subtitle>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCardA key={i} />
      ))}
    </ListPageWrapperSkeleton>
  );
}

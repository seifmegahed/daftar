import { SkeletonCardA } from "./card-a";
import { SkeletonCardB } from "./card-b";
import InfoPageSkeletonWrapper from "./info-page-wrapper-skeleton";

export function CardBAltListSkeleton() {
  return (
    <InfoPageSkeletonWrapper>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCardB key={i} />
        ))}
      </div>
    </InfoPageSkeletonWrapper>
  );
}

export function CardAAltListSkeleton() {
  return (
    <InfoPageSkeletonWrapper>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCardA key={i} />
        ))}
      </div>
    </InfoPageSkeletonWrapper>
  );
}

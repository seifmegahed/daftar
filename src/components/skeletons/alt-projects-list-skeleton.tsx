import { SkeletonCardB } from "./card-b";
import InfoPageSkeletonWrapper from "./info-page-wrapper-skeleton";

function AltProjectsListSkeleton() {
  return (
    <InfoPageSkeletonWrapper>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCardB key={i} />
        ))}
      </div>
    </InfoPageSkeletonWrapper>
  )
}

export default AltProjectsListSkeleton;

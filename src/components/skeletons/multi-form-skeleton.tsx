import { Skeleton } from "@/components/ui/skeleton";
import InfoPageSkeletonWrapper from "./info-page-wrapper-skeleton";
import SubmitButtonSkeleton from "./submit-button-skeleton";

function OneInputFormSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-[1.2rem] w-[10rem]" />
      <Skeleton className="h-[2rem] w-full" />
      <Skeleton className="h-[0.8rem] w-3/4" />
      <SubmitButtonSkeleton />
    </div>
  );
}

function MultipleInputFormSkeleton() {
  return (
    <InfoPageSkeletonWrapper>
      <OneInputFormSkeleton />
      <OneInputFormSkeleton />
      <OneInputFormSkeleton />
    </InfoPageSkeletonWrapper>
  );
}

export default MultipleInputFormSkeleton;

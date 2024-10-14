import InfoPageSkeletonWrapper from "@/components/skeletons/info-page-wrapper-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

function SectionSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="h-[2rem] w-40" />
      <Separator />
      <div className="flex flex-col gap-y-3 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function TextInfoSkeleton({ labelWidth = "1/4", valueWidth = "1/4" }) {
  return (
    <div className="flex justify-between">
      <Skeleton className={`h-[0.8rem] w-${labelWidth}`} />
      <Skeleton className={`h-[0.8rem] w-${valueWidth}`} />
    </div>
  );
}

function MultiTextInfoSkeleton() {
  return (
    <div className="flex justify-between pt-4">
      <Skeleton className="h-[0.8rem] w-[200px]" />
      <div className="flex flex-col items-end gap-y-2">
        <Skeleton className="h-[0.8rem] w-1/3" />
        <Skeleton className="h-[0.8rem] w-2/3" />
        <Skeleton className="h-[0.8rem] w-1/4" />
      </div>
    </div>
  );
}

function GeneralInfoSkeleton() {
  return (
    <SectionSkeleton>
      <TextInfoSkeleton labelWidth="1/4" valueWidth="1/4" />
      <TextInfoSkeleton labelWidth="2/3" valueWidth="1/4" />
      <TextInfoSkeleton labelWidth="1/4" valueWidth="1/2" />
      <TextInfoSkeleton labelWidth="1/3" valueWidth="1/3" />
      <MultiTextInfoSkeleton />
      <MultiTextInfoSkeleton />
    </SectionSkeleton>
  );
}

function OtherInfoSkeleton() {
  return (
    <SectionSkeleton>
      <TextInfoSkeleton labelWidth="1/4" valueWidth="1/3" />
      <TextInfoSkeleton labelWidth="1/4" valueWidth="2/3" />
      <TextInfoSkeleton labelWidth="1/3" valueWidth="1/3" />
      <TextInfoSkeleton labelWidth="1/3" valueWidth="1/4" />
    </SectionSkeleton>
  );
}

function NotesSkeleton() {
  return (
    <SectionSkeleton>
      <Skeleton className="h-[0.8rem] w-full" />
      <Skeleton className="h-[0.8rem] w-full" />
      <Skeleton className="h-[0.8rem] w-1/3" />
    </SectionSkeleton>
  );
}

function InfoPageSkeleton() {
  return (
    <InfoPageSkeletonWrapper>
      <GeneralInfoSkeleton />
      <OtherInfoSkeleton />
      <NotesSkeleton />
    </InfoPageSkeletonWrapper>
  );
}

export default InfoPageSkeleton;

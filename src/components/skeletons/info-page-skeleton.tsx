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

function TextInfoSkeleton({ labelWidth = "120", valueWidth = "100" }) {
  return (
    <div className="flex justify-between">
      <Skeleton className={`h-[0.8rem] w-[${labelWidth}px]`} />
      <Skeleton className={`h-[0.8rem] w-[${valueWidth}px]`} />
    </div>
  );
}

function MultiTextInfoSkeleton() {
  return (
    <div className="flex justify-between pt-4">
      <Skeleton className="h-[0.8rem] w-[200px]" />
      <div className="flex flex-col items-end gap-y-2">
        <Skeleton className="h-[0.8rem] w-[150px]" />
        <Skeleton className="h-[0.8rem] w-[300px]" />
        <Skeleton className="h-[0.8rem] w-[100px]" />
      </div>
    </div>
  );
}

function GeneralInfoSkeleton() {
  return (
    <SectionSkeleton>
      <TextInfoSkeleton labelWidth="150" valueWidth="100" />
      <TextInfoSkeleton labelWidth="300" valueWidth="150" />
      <TextInfoSkeleton labelWidth="100" valueWidth="80" />
      <TextInfoSkeleton labelWidth="150" valueWidth="150" />
      <MultiTextInfoSkeleton />
      <MultiTextInfoSkeleton />
    </SectionSkeleton>
  );
}

function OtherInfoSkeleton() {
  return (
    <SectionSkeleton>
      <TextInfoSkeleton labelWidth="100" valueWidth="150" />
      <TextInfoSkeleton labelWidth="150" valueWidth="300" />
      <TextInfoSkeleton labelWidth="100" valueWidth="150" />
      <TextInfoSkeleton labelWidth="150" valueWidth="100" />
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

import SubmitButtonSkeleton from "@/components/skeletons/submit-button-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

function FormFieldSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-[1.2rem] w-[10rem]" />
      <Skeleton className="h-[2rem] w-full" />
      <Skeleton className="h-[0.8rem] w-3/4" />
    </div>
  );
}

function FormFieldTextareaSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-[1.2rem] w-[10rem]" />
      <Skeleton className="h-[5rem] w-full" />
      <Skeleton className="h-[0.8rem] w-3/4" />
    </div>
  );
}

function FormWrapperSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-10 px-2 sm:px-0">
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-[2rem] w-1/3" />
        <Separator />
        <Skeleton className="h-[1.2rem] w-2/3" />
      </div>
      {children}
    </div>
  );
}

function FormSkeleton({ count = 3 }) {
  return (
    <FormWrapperSkeleton>
      {Array.from({ length: count - 1 }).map((_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
      <FormFieldTextareaSkeleton />
      <SubmitButtonSkeleton />
    </FormWrapperSkeleton>
  );
}

export default FormSkeleton;

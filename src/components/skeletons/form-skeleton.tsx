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

function FormWrapperSkeleton({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-[2rem] w-40" />
      <Skeleton className="h-[1.2rem] w-[30rem]" />
      <Separator />
      {children}
    </div>
  );
}

function FormSkeleton({ count = 5 }) {
  return (
    <FormWrapperSkeleton>
      {Array.from({ length: count }).map((_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
      <SubmitButtonSkeleton />
    </FormWrapperSkeleton>
  );
}

export default FormSkeleton;
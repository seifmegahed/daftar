import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

function InfoPageSkeletonWrapper({ children }: { children: ReactNode }) {
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

export default InfoPageSkeletonWrapper;
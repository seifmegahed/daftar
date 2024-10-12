import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

function ContactAddressCardSkeletonWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-[1.8rem] w-[10rem]" />
        <div className="flex gap-3">
          <Skeleton className="h-[2rem] w-32 rounded-full" />
          <Skeleton className="h-[2rem] w-32 rounded-full" />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4 text-muted-foreground">
        {children}
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[0.8rem] w-[100px]" />
        <Skeleton className="h-[0.8rem] w-full" />
        <Skeleton className="h-[0.8rem] w-full" />
        <Skeleton className="h-[0.8rem] w-1/3" />
      </div>
    </div>
  );
}

export default ContactAddressCardSkeletonWrapper;

import type { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

function ListPageWrapperSkeleton({
  children,
  subtitle,
  filter,
}: {
  children: ReactNode;
  subtitle?: boolean;
  filter?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-6 px-3 sm:px-0">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[15rem]" />
          {subtitle && <Skeleton className="h-4 w-[20rem]" />}
        </div>
        {filter && (
          <div className="flex items-center justify-between">
            <Skeleton className="h-[2rem] w-[300px]" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        )}
      </div>
      <div className="flex flex-col sm:gap-6">{children}</div>
    </div>
  );
}

export default ListPageWrapperSkeleton;

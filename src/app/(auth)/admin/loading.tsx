import PaginationSkeleton from "@/components/skeletons/pagination-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function AdminLoadingPage() {
  return (
    <div className="flex flex-col gap-4">
      <UsersListSkeleton />
      <PaginationSkeleton />
    </div>
  );
}

export function UsersListSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

function UserCardSkeleton() {
  return (
    <div className="flex gap-6 rounded-md border p-5">
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1.2rem] w-40" />
          <Skeleton className="h-[0.8rem] w-32" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-[0.8rem] w-32" />
          <Skeleton className="h-[0.8rem] w-32" />
          <Skeleton className="h-[0.8rem] w-40" />
        </div>
      </div>
      <div>
        <Skeleton className="-me-2 -mt-2 size-10 rounded-full" />
      </div>
    </div>
  );
}

export default AdminLoadingPage;

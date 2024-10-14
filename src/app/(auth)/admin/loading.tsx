import CardWrapper from "@/components/card-wrapper";
import ListPageWrapperSkeleton from "@/components/skeletons/list-page-wrapper-skeleton";
import PaginationSkeleton from "@/components/skeletons/pagination-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function AdminLoadingPage() {
  return (
    <ListPageWrapperSkeleton>
      <UsersListSkeleton />
      <PaginationSkeleton />
    </ListPageWrapperSkeleton>
  );
}

export function UsersListSkeleton({ count = 5 }) {
  return (
    <div className="flex flex-col sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

function UserCardSkeleton() {
  return (
    <CardWrapper>
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:gap-0">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[1.2rem] w-40" />
          <Skeleton className="h-[0.8rem] w-32" />
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Skeleton className="h-[0.8rem] w-32" />
          <Skeleton className="h-[0.8rem] w-32" />
          <Skeleton className="h-[0.8rem] w-40" />
        </div>
      </div>
      <div>
        <Skeleton className="-me-2 -mt-2 size-10 rounded-full" />
      </div>
    </CardWrapper>
  );
}

export default AdminLoadingPage;

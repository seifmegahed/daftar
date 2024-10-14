import { Skeleton } from "@/components/ui/skeleton";
import ContactAddressCardSkeletonWrapper from "./contact-address-card-skeleton-wrapper";
import ListPageWrapperSkeleton from "./list-page-wrapper-skeleton";

export function AddressCardSkeleton() {
  return (
    <ContactAddressCardSkeletonWrapper>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-1/4" />
          <Skeleton className="h-[0.8rem] w-1/3" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-1/4" />
          <Skeleton className="h-[0.8rem] w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-1/3" />
          <Skeleton className="h-[0.8rem] w-1/4" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-1/4" />
          <Skeleton className="h-[0.8rem] w-1/3" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-1/4" />
          <Skeleton className="h-[0.8rem] w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-1/3" />
          <Skeleton className="h-[0.8rem] w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-1/3" />
          <Skeleton className="h-[0.8rem] w-1/3" />
        </div>
      </div>
    </ContactAddressCardSkeletonWrapper>
  );
}

function AddressesSkeleton() {
  return (
    <ListPageWrapperSkeleton subtitle>
      <AddressCardSkeleton />
      <AddressCardSkeleton />
      <AddressCardSkeleton />
    </ListPageWrapperSkeleton>
  );
}

export default AddressesSkeleton;

import InfoPageSkeletonWrapper from "@/components/skeletons/info-page-wrapper-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import ContactAddressCardSkeletonWrapper from "./contact-address-card-skeleton-wrapper";

function ContactCardSkeleton() {
  return (
    <ContactAddressCardSkeletonWrapper>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-[100px]" />
          <Skeleton className="h-[0.8rem] w-[150px]" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-[100px]" />
          <Skeleton className="h-[0.8rem] w-[80px]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-[100px]" />
          <Skeleton className="h-[0.8rem] w-[150px]" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-[100px]" />
          <Skeleton className="h-[0.8rem] w-[80px]" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-[80px]" />
          <Skeleton className="h-[0.8rem] w-[100px]" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-[0.8rem] w-[100px]" />
          <Skeleton className="h-[0.8rem] w-[150px]" />
        </div>
      </div>
    </ContactAddressCardSkeletonWrapper>
  );
}

function ContactsSkeleton() {
  return (
    <InfoPageSkeletonWrapper>
      <ContactCardSkeleton />
      <ContactCardSkeleton />
      <ContactCardSkeleton />
    </InfoPageSkeletonWrapper>
  );
}

export default ContactsSkeleton;

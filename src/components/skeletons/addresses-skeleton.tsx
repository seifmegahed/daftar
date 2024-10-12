import InfoPageSkeletonWrapper from "@/components/skeletons/info-page-wrapper-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function AddressCardSkeleton() {
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
      </div>
    </div>
  );
}

function AddressesSkeleton() {
  return (
    <InfoPageSkeletonWrapper>
      <AddressCardSkeleton />
      <AddressCardSkeleton />
      <AddressCardSkeleton />
    </InfoPageSkeletonWrapper>
  );
}

export default AddressesSkeleton;

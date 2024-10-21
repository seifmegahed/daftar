import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import InfoPageSkeleton from "@/components/skeletons/info-page-skeleton";

function BaseLoading() {
  return (
    <div className="h-fit min-h-[calc(100vh_-_theme(spacing.16))]">
      <div className="h-fit min-h-[calc(100vh_-_theme(spacing.16))]">
        <div className="space-y-6 p-0 pb-16 md:px-6">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:gap-x-12 lg:space-y-0">
            <div className="w-full max-w-full lg:-ms-4 lg:w-1/5">
              <div className="max-w-screen flex h-16 min-w-56 space-x-2 lg:h-full lg:flex-col lg:space-x-0 lg:space-y-1 lg:px-4">
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
            <div className="flex-1 lg:max-w-2xl">
              <InfoPageSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BaseLoading;

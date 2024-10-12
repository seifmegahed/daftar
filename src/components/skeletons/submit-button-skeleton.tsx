import { Skeleton } from "@/components/ui/skeleton";

function SubmitButtonSkeleton() {
  return (
    <div className="flex justify-end py-4">
      <Skeleton className="h-[2.5rem] w-40" />
    </div>
  );
}

export default SubmitButtonSkeleton;

import SubmitButtonSkeleton from "@/components/skeletons/submit-button-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function AltDocumentFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-12 w-[400px]" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[2rem] w-40" />
        <Separator />
        <Skeleton className="h-[2rem] w-[300px]" />
        <Skeleton className="h-[1rem] w-full" />
        <Skeleton className="h-[1rem] w-1/4" />
        <SubmitButtonSkeleton />
      </div>
    </div>
  );
}

export default AltDocumentFormSkeleton;

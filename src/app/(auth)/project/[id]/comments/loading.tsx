import PaginationSkeleton from "@/components/skeletons/pagination-skeleton";
import { CommentsListSkeleton } from "@/components/skeletons/comment-skeletons";

function CommentsLoadingPage() {
  return (
    <div className="flex flex-col gap-4">
      <CommentsListSkeleton />
      <PaginationSkeleton />
    </div>
  );
}

export default CommentsLoadingPage;

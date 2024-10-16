import { AvatarContainer } from "@/components/avatar";
import { getCurrentUserAction } from "@/server/actions/users";
import { getInitials } from "@/utils/user";
import ProjectCommentForm from "./form";
import {
  getProjectCommentsAction,
  getProjectCommentsCountAction,
} from "@/server/actions/project-comments/read";
import Pagination from "@/components/pagination";
import { Suspense } from "react";
import { CommentsListSkeleton } from "@/components/skeletons/comment-skeletons";
import CommentsList from "./comments-list";
import ErrorPage from "@/components/error";

async function ProjectCommentsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) {
  const projectId = parseInt(params.id);
  if (isNaN(projectId)) return <ErrorPage message="Invalid project ID" />;

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null)
    return <ErrorPage message={currentUserError} />;

  const [count, countError] = await getProjectCommentsCountAction(projectId);
  if (countError !== null) return <ErrorPage message={countError} />;

  const pageParam = parseInt(searchParams.page ?? "1");
  const page = isNaN(pageParam) ? 1 : pageParam;
  const commentsPerPage = 10;
  const numberOfPages = Math.ceil(count / commentsPerPage);

  const [projectComments, error] = await getProjectCommentsAction(
    projectId,
    page,
    commentsPerPage,
  );
  if (error !== null) return <ErrorPage message={error} />;

  return (
    <div className="flex flex-col gap-5 px-2 sm:px-0">
      <div className="flex gap-4">
        <AvatarContainer>{getInitials(currentUser.name)}</AvatarContainer>
        <ProjectCommentForm projectId={projectId} />
      </div>
      <div className="flex flex-grow flex-col gap-4">
        <Suspense fallback={<CommentsListSkeleton />}>
          <CommentsList
            comments={projectComments}
            currentUserId={currentUser.id}
            projectId={projectId}
          />
        </Suspense>
        <Pagination totalPages={numberOfPages} />
      </div>
    </div>
  );
}

export default ProjectCommentsPage;

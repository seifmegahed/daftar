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

async function ProjectCommentsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page: string };
}) {
  const page = Number(searchParams.page) ?? 1;
  const projectId = Number(params.id);
  if (isNaN(projectId)) return <div>Error: Project ID is invalid</div>;

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return <div>Error getting current user</div>;

  const [projectCommentsCount, countError] =
    await getProjectCommentsCountAction(projectId);
  if (countError !== null)
    return <div>Error getting project comments count</div>;

  const commentsPerPage = 10;
  const numberOfPages = Math.ceil(projectCommentsCount / commentsPerPage);

  const [projectComments, error] = await getProjectCommentsAction(
    projectId,
    page,
    commentsPerPage,
  );
  if (error !== null) return <div>Error getting project comments</div>;

  return (
    <div className="flex flex-col gap-5 sm:px-0 px-2">
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

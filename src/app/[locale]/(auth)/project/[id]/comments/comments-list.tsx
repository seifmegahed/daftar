import ProjectCommentCard from "./comment-card";
import type { ProjectCommentType } from "@/server/db/tables/project-comment/queries";

async function CommentsList({
  comments,
  currentUserId,
  projectId,
}: {
  comments: ProjectCommentType[];
  currentUserId: number;
  projectId: number;
}) {
  return (
    <>
      {comments.map((comment) => (
        <ProjectCommentCard
          key={comment.id}
          comment={comment}
          userId={currentUserId}
          projectId={projectId}
        />
      ))}
    </>
  );
}

export default CommentsList;

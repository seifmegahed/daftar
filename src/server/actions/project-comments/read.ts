import {
  getCommentById,
  getProjectComments,
  getProjectCommentsCount,
} from "@/server/db/tables/project-comment/queries";

import type { ProjectCommentType } from "@/server/db/tables/project-comment/queries";
import type { InsertProjectCommentType } from "@/server/db/tables/project-comment/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const getProjectCommentsAction = async (
  projectId: number,
): Promise<ReturnTuple<ProjectCommentType[]>> => {
  const [comments, error] = await getProjectComments(projectId);
  if (error !== null) return [null, error];
  return [comments, null];
};

export const getProjectCommentsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [count, error] = await getProjectCommentsCount(projectId);
  if (error !== null) return [null, error];
  return [count, null];
};

export const getProjectCommentByIdAction = async (
  commentId: number,
): Promise<ReturnTuple<InsertProjectCommentType>> => {
  const [comment, error] = await getCommentById(commentId);
  if (error !== null) return [null, error];
  return [comment, null];
};

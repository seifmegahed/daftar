"use server";

import {
  getProjectCommentById,
  getProjectComments,
  getProjectCommentsCount,
} from "@/server/db/tables/project-comment/queries";

import type { ProjectCommentType } from "@/server/db/tables/project-comment/queries";
import type { InsertProjectCommentType } from "@/server/db/tables/project-comment/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const getProjectCommentsAction = async (
  projectId: number,
  page: number,
  limit?: number,
): Promise<ReturnTuple<ProjectCommentType[]>> => {
  const [comments, error] = await getProjectComments(projectId, page, limit);
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
  id: number,
): Promise<ReturnTuple<InsertProjectCommentType>> => {
  const [comment, error] = await getProjectCommentById(id);
  if (error !== null) return [null, error];
  return [comment, null];
};

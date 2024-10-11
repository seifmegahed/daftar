"use server";

import { revalidatePath } from "next/cache";

import { getProjectCommentByIdAction } from "./read";
import { getCurrentUserIdAction } from "@/server/actions/users";
import { deleteProjectComment } from "@/server/db/tables/project-comment/queries";

import type { ReturnTuple } from "@/utils/type-utils";

export const deleteProjectCommentAction = async (
  id: number,
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserIdAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [comment, commentError] = await getProjectCommentByIdAction(id);
  if (commentError !== null) return [null, commentError];
  if (comment.createdBy !== currentUser) return [null, "Not authorized"];

  const [deleted, deleteError] = await deleteProjectComment(id);
  if (deleteError !== null) return [null, deleteError];

  revalidatePath(`/project/${projectId}`);
  revalidatePath(`/project/${projectId}/comments`);

  return [deleted, null];
};

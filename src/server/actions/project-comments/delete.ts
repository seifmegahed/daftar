"use server";

import { revalidatePath } from "next/cache";

import { deleteProjectComment } from "@/server/db/tables/project-comment/mutations";
import { getProjectCommentByIdAction } from "./read";
import { getCurrentUserIdAction } from "@/server/actions/users";

import type { ReturnTuple } from "@/utils/type-utils";

export const deleteProjectCommentAction = async (
  id: number,
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [comment, commentError] = await getProjectCommentByIdAction(id);
  if (commentError !== null) return [null, commentError];
  if (comment.createdBy !== currentUserId) return [null, "Not authorized"];

  const [deleted, deleteError] = await deleteProjectComment(id);
  if (deleteError !== null) return [null, deleteError];

  revalidatePath(`/project/${projectId}`);
  revalidatePath(`/project/${projectId}/comments`);

  return [deleted, null];
};

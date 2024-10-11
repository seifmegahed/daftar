"use server"

import { revalidatePath } from "next/cache";

import { insertProjectComment } from "@/server/db/tables/project-comment/queries";
import { insertProjectCommentSchema } from "@/server/db/tables/project-comment/schema";
import { getCurrentUserIdAction } from "@/server/actions/users";

import type { ReturnTuple } from "@/utils/type-utils";
import type { z } from "zod";

const createProjectCommentSchema = insertProjectCommentSchema.omit({
  createdBy: true,
});

type CreateProjectCommentType = z.infer<typeof createProjectCommentSchema>;

export const createProjectCommentAction = async (
  data: CreateProjectCommentType,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserIdAction();
  if (currentUserError !== null) return [null, currentUserError];
  const isValid = createProjectCommentSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];
  const [result, error] = await insertProjectComment({
    ...isValid.data,
    createdBy: currentUser,
  });
  if (error !== null) return [null, error];

  revalidatePath(`/project/${isValid.data.projectId}`);
  revalidatePath(`/project/${isValid.data.projectId}/comments`);

  return [result, null];
};

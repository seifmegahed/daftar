"use server";

import { revalidatePath } from "next/cache";

import { insertProjectComment } from "@/server/db/tables/project-comment/mutations";
import { insertProjectCommentSchema } from "@/server/db/tables/project-comment/schema";
import { getCurrentUserIdAction } from "@/server/actions/users";

import { errorLogger } from "@/lib/exceptions";

import type { z } from "zod";
import type { ReturnTuple } from "@/utils/type-utils";

const commentsErrorLog = errorLogger("Comments Create Action Error:");

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
  if (isValid.error) {
    commentsErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [result, error] = await insertProjectComment({
    ...isValid.data,
    createdBy: currentUser,
  });
  if (error !== null) return [null, error];

  revalidatePath(`/project/${isValid.data.projectId}`);
  revalidatePath(`/project/${isValid.data.projectId}/comments`);

  return [result, null];
};

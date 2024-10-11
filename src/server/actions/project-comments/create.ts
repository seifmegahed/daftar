import { revalidatePath } from "next/cache";

import { insertProjectComment } from "@/server/db/tables/project-comment/queries";
import { insertProjectCommentSchema } from "@/server/db/tables/project-comment/schema";

import type { InsertProjectCommentType } from "@/server/db/tables/project-comment/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const createProjectCommentAction = async (
  data: InsertProjectCommentType,
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const isValid = insertProjectCommentSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];
  const [result, error] = await insertProjectComment(data);
  if (error !== null) return [null, error];

  revalidatePath(`/project/${projectId}`);
  revalidatePath(`/project/${projectId}/comments`);

  return [result, null];
};

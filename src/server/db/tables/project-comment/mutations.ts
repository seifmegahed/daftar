import { z } from "zod";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { projectCommentsTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { ReturnTuple } from "@/utils/type-utils";
import type { InsertProjectCommentType } from "./schema";

const errorMessages = {
  mainTitle: "Project Comment Mutations Error:",
  insert: "An error occurred while adding comment",
  update: "An error occurred while updating comment",
  delete: "An error occurred while deleting comment",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertProjectComment = async (
  data: InsertProjectCommentType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [comment] = await db
      .insert(projectCommentsTable)
      .values(data)
      .returning();

    if (!comment) return [null, errorMessage];
    return [comment.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const projectCommentSchema = z.object({
  id: z.number(),
  text: z.string(),
  createdAt: z.date(),
  userId: z.number(),
  userName: z.string(),
});

export const deleteProjectComment = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [comment] = await db
      .delete(projectCommentsTable)
      .where(eq(projectCommentsTable.id, id))
      .returning();

    if (!comment) return [null, errorMessage];
    return [comment.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

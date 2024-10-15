import { db } from "@/server/db";
import { projectCommentsTable } from "./schema";
import type { InsertProjectCommentType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { z } from "zod";
import { usersTable } from "../user/schema";
import { desc, eq, count } from "drizzle-orm";
import { errorLogger } from "@/lib/exceptions";

const errorMessages = {
  mainTitle: "Project Comment Queries Error:",
  insert: "An error occurred while adding comment",
  update: "An error occurred while updating comment",
  delete: "An error occurred while deleting comment",
  getComments: "An error occurred while getting comments",
  getComment: "An error occurred while getting comment",
  count: "An error occurred while counting comments",
  dataCorrupted: "It seems that some data is corrupted",
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

export type ProjectCommentType = z.infer<typeof projectCommentSchema>;

export const getProjectComments = async (
  projectId: number,
  page: number,
  limit = 15,
): Promise<ReturnTuple<ProjectCommentType[]>> => {
  const errorMessage = errorMessages.getComments;
  try {
    const comments = await db
      .select({
        id: projectCommentsTable.id,
        text: projectCommentsTable.text,
        createdAt: projectCommentsTable.createdAt,
        userId: projectCommentsTable.createdBy,
        userName: usersTable.name,
      })
      .from(projectCommentsTable)
      .leftJoin(usersTable, eq(projectCommentsTable.createdBy, usersTable.id))
      .where(eq(projectCommentsTable.projectId, projectId))
      .orderBy(desc(projectCommentsTable.createdAt))
      .offset((page - 1) * limit)
      .limit(limit);

    if (!comments) return [null, errorMessage];
    const parseResult = z.array(projectCommentSchema).safeParse(comments);
    if (!parseResult.success) return [null, errorMessages.dataCorrupted];

    return [parseResult.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getProjectCommentsCount = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [result] = await db
      .select({
        count: count(),
      })
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.projectId, projectId))
      .limit(1);
    if (!result) return [null, errorMessage];
    return [result.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

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

export const getProjectCommentById = async (
  id: number,
): Promise<ReturnTuple<InsertProjectCommentType>> => {
  const errorMessage = errorMessages.getComment;
  try {
    const [comment] = await db
      .select()
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.id, id))
      .limit(1);

    if (!comment) return [null, errorMessage];
    return [comment, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

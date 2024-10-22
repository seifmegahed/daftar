import { z } from "zod";
import { db } from "@/server/db";
import { desc, eq, count } from "drizzle-orm";
import { usersTable, projectCommentsTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertProjectCommentType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { performanceTimer } from "@/utils/performance";

const errorMessages = {
  mainTitle: "Project Comment Queries Error:",
  getComments: "An error occurred while getting comments",
  getComment: "An error occurred while getting comment",
  count: "An error occurred while counting comments",
  dataCorrupted: "It seems that some data is corrupted",
};

const logError = errorLogger(errorMessages.mainTitle);

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
  const timer = new performanceTimer("getProjectComments");
  try {
    timer.start();
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
    timer.end();

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
  const timer = new performanceTimer("getProjectCommentsCount");
  try {
    timer.start();
    const [result] = await db
      .select({
        count: count(),
      })
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.projectId, projectId))
      .limit(1);
    timer.end();

    if (!result) return [null, errorMessage];
    return [result.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getProjectCommentById = async (
  id: number,
): Promise<ReturnTuple<InsertProjectCommentType>> => {
  const errorMessage = errorMessages.getComment;
  const timer = new performanceTimer("getProjectCommentById");
  try {
    timer.start();
    const [comment] = await db
      .select()
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.id, id))
      .limit(1);
    timer.end();

    if (!comment) return [null, errorMessage];
    return [comment, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

import { db } from "@/server/db";
import { projectCommentsTable } from "./schema";
import type { InsertProjectCommentType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { z } from "zod";
import { usersTable } from "../user/schema";
import { desc, eq, count } from "drizzle-orm";

export const insertProjectComment = async (
  data: InsertProjectCommentType,
): Promise<ReturnTuple<number>> => {
  try {
    const [comment] = await db
      .insert(projectCommentsTable)
      .values(data)
      .returning({ id: projectCommentsTable.id });

    if (!comment) return [null, "Error inserting new project comment"];
    return [comment.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error inserting new project comment"];
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
): Promise<ReturnTuple<ProjectCommentType[]>> => {
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
      .orderBy(desc(projectCommentsTable.id));

    if (!comments) return [null, "Error getting project comments"];
    const parseResult = z.array(projectCommentSchema).safeParse(comments);
    if (!parseResult.success) return [null, "Error parsing project comments"];
    return [parseResult.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project comments"];
  }
};

export const getProjectCommentsCount = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .select({
        count: count(),
      })
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.projectId, projectId))
      .limit(1);
    if (!result) return [null, "Error getting project comments count"];
    return [result.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project comments count"];
  }
};

export const getCommentById = async (
  commentId: number,
): Promise<ReturnTuple<InsertProjectCommentType>> => {
  try {
    const [comment] = await db
      .select()
      .from(projectCommentsTable)
      .where(eq(projectCommentsTable.id, commentId));
    if (!comment) return [null, "Error getting comment"];
    return [comment, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting comment"];
  }
};

export const deleteProjectComment = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [comment] = await db
      .delete(projectCommentsTable)
      .where(eq(projectCommentsTable.id, id))
      .returning({ id: projectCommentsTable.id });

    if (!comment) return [null, "Error deleting project comment"];
    return [comment.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error deleting project comment"];
  }
};

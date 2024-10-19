import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  projectsTable,
  purchaseItemsTable,
  documentRelationsTable,
  saleItemsTable,
} from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertProjectType, SelectProjectType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Project Mutations Error:",
  insert: "An error occurred while adding project",
  update: "An error occurred while updating project",
  delete: "An error occurred while deleting project",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertProject = async (
  data: InsertProjectType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [project] = await db.insert(projectsTable).values(data).returning();

    if (!project) return [null, errorMessage];
    return [project.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const updateProject = async (
  id: number,
  data: Partial<SelectProjectType>,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [project] = await db
      .update(projectsTable)
      .set(data)
      .where(eq(projectsTable.id, id))
      .returning();

    if (!project) return [null, errorMessage];
    return [project.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteProject = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const project = await db.transaction(async (tx) => {
      await tx
        .delete(purchaseItemsTable)
        .where(eq(purchaseItemsTable.projectId, id));

      await tx.delete(saleItemsTable).where(eq(saleItemsTable.projectId, id));

      await tx
        .delete(documentRelationsTable)
        .where(eq(documentRelationsTable.projectId, id));

      const [project] = await tx
        .delete(projectsTable)
        .where(eq(projectsTable.id, id))
        .returning();

      return project;
    });

    if (!project) return [null, errorMessage];
    return [project.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

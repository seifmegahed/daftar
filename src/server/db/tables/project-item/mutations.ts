import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { projectItemsTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertProjectItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Project Items Queries Error:",
  insert: "An error occurred while adding sale item",
  delete: "An error occurred while deleting purchase item",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertProjectItem = async (
  data: InsertProjectItemType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [project] = await db
      .insert(projectItemsTable)
      .values(data)
      .returning();

    if (!project) return [null, errorMessage];
    return [project.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteProjectItem = async (
  projectItemId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [projectItem] = await db
      .delete(projectItemsTable)
      .where(eq(projectItemsTable.id, projectItemId))
      .returning();

    if (!projectItem) return [null, errorMessage];
    return [projectItem.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

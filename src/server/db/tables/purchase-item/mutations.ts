import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { purchaseItemsTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertPurchaseItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Purchase Items Mutations Error:",
  insert: "An error occurred while adding purchase item",
  delete: "An error occurred while deleting purchase item",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertPurchaseItem = async (
  data: InsertPurchaseItemType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [project] = await db
      .insert(purchaseItemsTable)
      .values(data)
      .returning();

    if (!project) return [null, errorMessage];
    return [project.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deletePurchaseItem = async (
  projectItemId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [projectItem] = await db
      .delete(purchaseItemsTable)
      .where(eq(purchaseItemsTable.id, projectItemId))
      .returning();

    if (!projectItem) return [null, errorMessage];
    return [projectItem.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

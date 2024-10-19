import { db } from "@/server/db";
import { eq } from "drizzle-orm";

import { itemsTable } from "./schema";

import { checkUniqueConstraintError, errorLogger } from "@/lib/exceptions";

import type { AddItemType, SelectItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Item Mutations Error:",
  insert: "An error occurred while adding item",
  update: "An error occurred while updating item",
  delete: "An error occurred while deleting item",
  nameExits: "Item name already exists",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertItem = async (
  data: AddItemType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [item] = await db.insert(itemsTable).values(data).returning();
    if (!item) return [null, errorMessage];

    return [item.id, null];
  } catch (error) {
    logError(error);
    return [
      null,
      checkUniqueConstraintError(error)
        ? errorMessages.nameExits
        : errorMessage,
    ];
  }
};

export const updateItem = async (
  id: number,
  data: Partial<SelectItemType>,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [item] = await db
      .update(itemsTable)
      .set(data)
      .where(eq(itemsTable.id, id))
      .returning();

    if (!item) return [null, errorMessage];

    return [item.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteItem = async (id: number): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [item] = await db
      .delete(itemsTable)
      .where(eq(itemsTable.id, id))
      .returning();

    if (!item) return [null, errorMessage];

    return [item.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

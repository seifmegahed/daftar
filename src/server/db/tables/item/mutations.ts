import { db } from "@/server/db";
import { eq, inArray } from "drizzle-orm";
import { itemsTable, itemTagTable, tagTable } from "@/server/db/schema";

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
  tags: string[] = [],
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const item = await db.transaction(async (tx) => {
      const [insertedItem] = await tx
        .insert(itemsTable)
        .values(data)
        .returning();
      if (!insertedItem) return;

      if (tags.length === 0) return insertedItem;

      const existingTags = await tx
        .select()
        .from(tagTable)
        .where(inArray(tagTable.name, tags));

      // Filter to get new tags
      const newTags = tags.filter(
        (tag) => !existingTags.some((existingTag) => existingTag.name === tag),
      );

      if (newTags.length === 0) {
        // If no new tags, just create item-tag relations with existing tags
        const itemTags = existingTags.map((tag) => ({
          itemId: insertedItem.id,
          tagId: tag.id,
        }));

        const result = await tx
          .insert(itemTagTable)
          .values(itemTags)
          .returning();

        if (!result[0]) {
          tx.rollback();
          return;
        }

        return insertedItem;
      }

      // Insert new tags
      const newInsertedTags = await tx
        .insert(tagTable)
        .values(newTags.map((tag) => ({ name: tag })))
        .returning();

      // Combine existing and new tags and create supplier-tag objects
      const itemTags = [...existingTags, ...newInsertedTags].map((tag) => ({
        itemId: insertedItem.id,
        tagId: tag.id,
      }));
      console.log("itemTags", itemTags);

      const result = await tx.insert(itemTagTable).values(itemTags).returning();

      if (!result[0]) {
        tx.rollback();
        return;
      }

      return insertedItem;
    });
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
    const item = await db.transaction(async (tx) => {
      await tx.delete(itemTagTable).where(eq(itemTagTable.itemId, id));
      
      const [deletedItem] = await tx
        .delete(itemsTable)
        .where(eq(itemsTable.id, id))
        .returning();

      if (!deletedItem) return;

      return deletedItem;
    });

    if (!item) return [null, errorMessage];

    return [item.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

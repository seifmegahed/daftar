import { db } from "../..";
import { tagTable } from "../tag/schema";
import { supplierTagTable } from "./schema";
import { inArray } from "drizzle-orm";

import type { ReturnTuple } from "@/utils/type-utils";

type SupplierTagType = {
  id: number;
  tagId: number;
  supplierId: number;
};

export const addSupplierTags = async ({
  supplierId,
  tags,
}: {
  supplierId: number;
  tags: { name: string }[];
}): Promise<ReturnTuple<SupplierTagType[]>> => {
  try {
    const result = await db.transaction(async (tx) => {
      // Get existing tags
      const existingTags = await tx
        .select()
        .from(tagTable)
        .where(
          inArray(
            tagTable.name,
            tags.map((tag) => tag.name),
          ),
        );

      // Filter to get new tags
      const newTags = tags.filter(
        (tag) =>
          !existingTags.some((existingTag) => existingTag.name === tag.name),
      );

      // Insert new tags
      const newInsertedTags = await tx
        .insert(tagTable)
        .values(newTags)
        .returning();

      // Combine existing and new tags and create supplier-tag objects
      const supplierTags = [...existingTags, ...newInsertedTags].map((tag) => ({
        supplierId: supplierId,
        tagId: tag.id,
      }));

      // Insert supplier-tag objects
      const result = await tx
        .insert(supplierTagTable)
        .values(supplierTags)
        .returning();

      if (!result[0]) {
        tx.rollback();
        return;
      }

      return result;
    });
    if (!result) {
      return [null, "Error adding supplier tags"];
    }
    return [result, null];
  } catch (error) {
    console.error(error);
    return [null, "Error adding supplier tags"];
  }
};

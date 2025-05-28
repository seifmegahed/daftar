import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { supplierTagTable } from "./schema";
import { tagTable } from "../tag/schema";

export const getSupplierTags = async (supplierId: number) => {
  try {
    const result = await db
      .select({
        id: supplierTagTable.id,
        tagId: supplierTagTable.tagId,
        tagName: tagTable.name,
      })
      .from(supplierTagTable)
      .where(eq(supplierTagTable.supplierId, supplierId))
      .leftJoin(tagTable, eq(supplierTagTable.tagId, tagTable.id));

    if (!result.length) return [null, "No tags found for this supplier"];

    return [result, null];
  } catch (error) {
    console.error("Error fetching supplier tags:", error);
    return [null, "Error fetching supplier tags"];
  }
};

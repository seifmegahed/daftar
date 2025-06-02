import { and, eq, inArray } from "drizzle-orm";
import type { PgTable, PgColumn } from "drizzle-orm/pg-core";
import { db } from "@/server/db";
import { tagTable } from "../tag/schema";
import type { ReturnTuple } from "@/utils/type-utils";

/**
 * Updates the many-to-many tag relations for a given entity (e.g. project, supplier).
 * Ensures:
 * - New tags are inserted into the tag table (if missing)
 * - Old relations not in the updated tag list are removed
 * - New relations are inserted (if not already present)
 */
export async function updateEntityTags<TRelation extends PgTable>({
  foreignId,
  tags,
  relationTable,
  relationForeignKey,
  relationTagKey,
  createInsertObject, // New parameter to handle the insert object creation
}: {
  foreignId: number; // ID of the entity (e.g. project ID or supplier ID)
  tags: string[]; // List of tag names to associate with the entity
  relationTable: TRelation; // The join table (e.g. projectTagTable or supplierTagTable)
  relationForeignKey: PgColumn; // Column in the relation table pointing to the entity
  relationTagKey: PgColumn; // Column in the relation table pointing to the tag
  createInsertObject: (foreignId: number, tagId: number) => TRelation["$inferInsert"]; // Function to create insert object
}): Promise<ReturnTuple<TRelation["$inferInsert"][]>> {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Get existing relations along with their tag names
      const existingRelations = await tx
        .select({
          tagId: relationTagKey,
          name: tagTable.name,
        })
        .from(relationTable)
        .leftJoin(tagTable, eq(relationTagKey, tagTable.id))
        .where(eq(relationForeignKey, foreignId));

      // Create a set of existing tag names
      const existingNames = new Set(existingRelations.map((t) => t.name));

      // 2. Identify tags to remove: ones currently linked but not in the new list
      const toRemoveTagIds = existingRelations
        .filter((t) => !tags.includes(t.name!))
        .map((t) => t.tagId);

      // 3. Delete outdated tag relations from the join table
      if (toRemoveTagIds.length > 0) {
        await tx
          .delete(relationTable)
          .where(
            and(
              eq(relationForeignKey, foreignId),
              inArray(relationTagKey, toRemoveTagIds),
            ),
          );
      }

      // 4. Insert new tag names into tagTable if they don't exist (no duplicates due to onConflict)
      await tx
        .insert(tagTable)
        .values(tags.map((name) => ({ name })))
        .onConflictDoNothing();

      // 5. Retrieve all tag IDs matching the requested tag names
      const allTags = await tx
        .select({
          id: tagTable.id,
          name: tagTable.name,
        })
        .from(tagTable)
        .where(inArray(tagTable.name, tags));

      // 6. Filter to only the tags that aren't already linked
      const toLinkTags = allTags.filter((tag) => !existingNames.has(tag.name));

      // 7. Insert new tag relations into the join table
      if (toLinkTags.length > 0) {
        // Use the provided function to create properly typed insert objects
        const insertValues = toLinkTags.map((tag) => 
          createInsertObject(foreignId, tag.id)
        );

        const inserted = (await tx
          .insert(relationTable)
          .values(insertValues)
          .returning()) as TRelation["$inferInsert"][];

        return [inserted, null] as const;
      }

      return [[], null] as const;
    });

    return result as ReturnTuple<TRelation["$inferInsert"][]>;
  } catch (error) {
    console.error("Error updating tags:", error);
    return [null, "Failed to update tags"] as const;
  }
}
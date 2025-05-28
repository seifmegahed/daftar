/**
 * A schema for the Tag table.
 *
 * A tag is a label that can be assigned to an entity to categorize.
 * This makes it easier to search, filter, and match entities.
 *
 * In this context, tags will be assigned to items and suppliers.
 * This will allow matching items and suppliers based on tags in the RFQ phase.
 */

import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const tagTable = pgTable("tag", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

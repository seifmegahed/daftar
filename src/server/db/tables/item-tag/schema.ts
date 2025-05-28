import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { tagTable } from "../tag/schema";
import { itemsTable } from "../../schema";
import { relations } from "drizzle-orm";

export const itemTagTable = pgTable("item_tag", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => itemsTable.id),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tagTable.id),
});

export const itemTagRelations = relations(itemTagTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [itemTagTable.itemId],
    references: [itemsTable.id],
  }),
  tag: one(tagTable, {
    fields: [itemTagTable.tagId],
    references: [tagTable.id],
  }),
}));

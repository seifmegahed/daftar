import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { suppliersTable } from "../supplier/schema";
import { tagTable } from "../tag/schema";
import { relations } from "drizzle-orm";

export const supplierTagTable = pgTable("supplier_tag", {
  id: serial("id").notNull().primaryKey(),
  tagId: integer("tag_id")
    .notNull()
    .references(() => tagTable.id),
  supplierId: integer("supplier_id")
    .notNull()
    .references(() => suppliersTable.id),
});

export const supplierTagRelations = relations(supplierTagTable, ({ one }) => ({
  supplier: one(suppliersTable, {
    fields: [supplierTagTable.supplierId],
    references: [suppliersTable.id],
  }),
  tag: one(tagTable, {
    fields: [supplierTagTable.tagId],
    references: [tagTable.id],
  }),
}));

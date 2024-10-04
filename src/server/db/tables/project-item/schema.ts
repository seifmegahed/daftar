import { integer, numeric, pgTable, serial } from "drizzle-orm/pg-core";

import { itemsTable } from "../item/schema";
import { suppliersTable } from "../supplier/schema";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { projectsTable } from "../project/schema";

export const projectItemsTable = pgTable("project_items", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projectsTable.id)
    .notNull(),
  itemId: integer("item_id")
    .references(() => itemsTable.id)
    .notNull(),
  supplierId: integer("supplier_id")
    .references(() => suppliersTable.id)
    .notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: integer("currency").notNull(),
  quantity: integer("quantity").notNull(),
});

export const projectItemsRelations = relations(
  projectItemsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectItemsTable.projectId],
      references: [projectsTable.id],
    }),
    item: one(itemsTable, {
      fields: [projectItemsTable.itemId],
      references: [itemsTable.id],
    }),
    supplier: one(suppliersTable, {
      fields: [projectItemsTable.supplierId],
      references: [suppliersTable.id],
    }),
  }),
);

export const insertProjectItemSchema = createInsertSchema(projectItemsTable);
export const selectProjectItemSchema = createSelectSchema(projectItemsTable);

export type InsertProjectItemType = z.infer<typeof insertProjectItemSchema>;
export type SelectProjectItemType = z.infer<typeof selectProjectItemSchema>;

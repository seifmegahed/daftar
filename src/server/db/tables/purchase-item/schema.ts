import { integer, numeric, pgTable, serial } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { itemsTable, projectsTable, suppliersTable } from "@/server/db/schema";

export const purchaseItemsTable = pgTable("purchase_item", {
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

export const purchaseItemsRelations = relations(
  purchaseItemsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [purchaseItemsTable.projectId],
      references: [projectsTable.id],
    }),
    item: one(itemsTable, {
      fields: [purchaseItemsTable.itemId],
      references: [itemsTable.id],
    }),
    supplier: one(suppliersTable, {
      fields: [purchaseItemsTable.supplierId],
      references: [suppliersTable.id],
    }),
  }),
);

export const insertPurchaseItemSchema = createInsertSchema(purchaseItemsTable);
export const selectPurchaseItemSchema = createSelectSchema(purchaseItemsTable);

export type InsertPurchaseItemType = z.infer<typeof insertPurchaseItemSchema>;
export type SelectPurchaseItemType = z.infer<typeof selectPurchaseItemSchema>;

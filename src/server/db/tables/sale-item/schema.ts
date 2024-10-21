import { index, integer, numeric, pgTable, serial } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { itemsTable, projectsTable } from "@/server/db/schema";

export const saleItemsTable = pgTable(
  "sale_item",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id")
      .references(() => projectsTable.id)
      .notNull(),
    itemId: integer("item_id")
      .references(() => itemsTable.id)
      .notNull(),

    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    currency: integer("currency").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    projectIdIndex: index("sale_item_project_id_index").on(table.projectId),
    itemIdIndex: index("sale_item_item_id_index").on(table.itemId),
  }),
);

export const saleItemsRelations = relations(saleItemsTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [saleItemsTable.projectId],
    references: [projectsTable.id],
  }),
  item: one(itemsTable, {
    fields: [saleItemsTable.itemId],
    references: [itemsTable.id],
  }),
}));

export const insertSaleItemSchema = createInsertSchema(saleItemsTable);
export const selectSaleItemSchema = createSelectSchema(saleItemsTable);

export type InsertSaleItemType = z.infer<typeof insertSaleItemSchema>;
export type SelectSaleItemType = z.infer<typeof selectSaleItemSchema>;

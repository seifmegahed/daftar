import { integer, numeric, pgTable, serial } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { itemsTable, projectsTable } from "@/server/db/schema";

export const commercialOfferItemsTable = pgTable("commercial_offer_item", {
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
});

export const commercialOfferItemsRelations = relations(
  commercialOfferItemsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [commercialOfferItemsTable.projectId],
      references: [projectsTable.id],
    }),
    item: one(itemsTable, {
      fields: [commercialOfferItemsTable.itemId],
      references: [itemsTable.id],
    }),
  }),
);

export const insertCommercialOfferItemSchema = createInsertSchema(
  commercialOfferItemsTable,
);
export const selectCommercialOfferItemSchema = createSelectSchema(
  commercialOfferItemsTable,
);

export type InsertCommercialOfferItemType = z.infer<
  typeof insertCommercialOfferItemSchema
>;
export type SelectCommercialOfferItemType = z.infer<
  typeof selectCommercialOfferItemSchema
>;

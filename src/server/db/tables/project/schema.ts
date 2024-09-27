import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { clientsTable } from "../client/schema";
import { itemsTable } from "../item/schema";
import { suppliersTable } from "../supplier/schema";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const projectsTable = pgTable("project", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  status: integer("status").notNull(),
  description: varchar("description", { length: 256 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  notes: varchar("notes", { length: 256 }),

  // Foreign keys
  clientId: integer("client_id")
    .references(() => clientsTable.id)
    .notNull(),
  ownerId: integer("owner_id")
    .references(() => usersTable.id)
    .notNull(),

  // Interaction fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by").references(() => usersTable.id),
});

export const projectRelations = relations(projectsTable, ({ one }) => ({
  client: one(clientsTable, {
    fields: [projectsTable.clientId],
    references: [clientsTable.id],
  }),
  owner: one(usersTable, {
    fields: [projectsTable.ownerId],
    references: [usersTable.id],
  }),
  creator: one(usersTable, {
    fields: [projectsTable.createdBy],
    references: [usersTable.id],
  }),
  updater: one(usersTable, {
    fields: [projectsTable.updatedBy],
    references: [usersTable.id],
  }),
}));

export const insertProjectSchema = createInsertSchema(projectsTable);
export const selectProjectSchema = createSelectSchema(projectsTable);

export type InsertProjectType = z.infer<typeof insertProjectSchema>;
export type SelectProjectType = z.infer<typeof selectProjectSchema>;

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

import {
  date,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import type { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import {
  documentRelationsTable,
  clientsTable,
  usersTable,
  saleItemsTable,
  purchaseItemsTable,
} from "@/server/db/schema";
import { notesMaxLength } from "@/data/config";

export const projectsTable = pgTable(
  "project",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull().unique(),
    status: integer("status").notNull(),
    type: integer("type").notNull().default(0),
    description: varchar("description", { length: notesMaxLength }),
    startDate: date("start_date"),
    endDate: date("end_date"),
    notes: varchar("notes", { length: notesMaxLength }),

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
  },
  (table) => ({
    clientIdIndex: index("project_client_id_index").on(table.clientId),
    statusIndex: index("project_status_index").on(table.status),
    typeIndex: index("project_type_index").on(table.type),
    searchIndex: index("search_index").using(
      "gin",
      sql`(
        setweight(to_tsvector('english', ${table.name}), 'A') ||
        setweight(to_tsvector('english', coalesce(${table.description}, '')), 'B')
      )`,
    ),
  }),
);

export const projectRelations = relations(projectsTable, ({ one, many }) => ({
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
  documents: many(documentRelationsTable),
  saleItems: many(saleItemsTable),
  purchaseItems: many(purchaseItemsTable),
}));

export const insertProjectSchema = createInsertSchema(projectsTable);
export const selectProjectSchema = createSelectSchema(projectsTable);

export type InsertProjectType = z.infer<typeof insertProjectSchema>;
export type SelectProjectType = z.infer<typeof selectProjectSchema>;

import {
  date,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { usersTable } from "../user/schema";
import { clientsTable } from "../client/schema";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { documentRelationsTable } from "../document/schema";
import { notesMaxLength } from "@/data/config";
import { projectItemsTable } from "../project-item/schema";

export const projectsTable = pgTable(
  "project",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull().unique(),
    status: integer("status").notNull(),
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
  items: many(projectItemsTable),
}));

export const insertProjectSchema = createInsertSchema(projectsTable);
export const selectProjectSchema = createSelectSchema(projectsTable);

export type InsertProjectType = z.infer<typeof insertProjectSchema>;
export type SelectProjectType = z.infer<typeof selectProjectSchema>;

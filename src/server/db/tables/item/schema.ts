import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { documentRelationsTable } from "../document/schema";
import { notesMaxLength } from "@/data/config";

export const itemsTable = pgTable(
  "item",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull().unique(),
    type: varchar("type", { length: 64 }),
    description: varchar("description", { length: notesMaxLength }),
    mpn: varchar("mpn", { length: 128 }),
    make: varchar("make", { length: 64 }),
    notes: varchar("notes", { length: notesMaxLength }),

    // Interaction fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    createdBy: integer("created_by")
      .references(() => usersTable.id)
      .notNull(),
    updatedBy: integer("updated_by").references(() => usersTable.id),
  },
  (table) => ({
    itemsSearchIndex: index("items_search_index").using(
      "gin",
      sql`(
      setweight(to_tsvector('english', ${table.name}), 'A') ||
      setweight(to_tsvector('english', coalesce(${table.type}, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(${table.make}, '')), 'C')
    )`,
    ),
  }),
);

export const itemRelations = relations(itemsTable, ({ one, many }) => ({
  documents: many(documentRelationsTable),
  creator: one(usersTable, {
    fields: [itemsTable.createdBy],
    references: [usersTable.id],
  }),
  updater: one(usersTable, {
    fields: [itemsTable.updatedBy],
    references: [usersTable.id],
  }),
}));

export const insertItemSchema = createInsertSchema(itemsTable);
export const selectItemSchema = createSelectSchema(itemsTable);

export type AddItemType = z.infer<typeof insertItemSchema>;
export type SelectItemType = z.infer<typeof selectItemSchema>;

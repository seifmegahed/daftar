import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";
import { notesMaxLength } from "@/data/config";

export const documentsTable = pgTable(
  "document",
  {
    id: serial("id").primaryKey(),
    // Data fields
    name: varchar("name", { length: 64 }).notNull().unique(),
    path: varchar("path", { length: 256 }).notNull(),
    // path: varchar("path", { length: 256 }).notNull().unique(), // For production
    notes: varchar("notes", { length: notesMaxLength }),
    extension: varchar("extension", { length: 8 }).notNull(),

    // Interaction fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: integer("created_by")
      .references(() => usersTable.id)
      .notNull(),
  },
  (table) => ({
    documentsSearchIndex: index("documents_search_index").using(
      "gin",
      sql`(
      setweight(to_tsvector('english', ${table.name}), 'A') ||
      setweight(to_tsvector('english', ${table.extension}), 'B')
    )`,
    ),
  }),
);

export const documentRelations = relations(documentsTable, ({ one }) => ({
  creator: one(usersTable, {
    fields: [documentsTable.createdBy],
    references: [usersTable.id],
  }),
}));

export const documentSchema = createInsertSchema(documentsTable);
export type DocumentDataType = z.infer<typeof documentSchema>;

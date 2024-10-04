import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, sql } from "drizzle-orm";

import {
  usersTable,
  contactsTable,
  addressesTable,
  documentRelationsTable,
} from "@/server/db/schema";
import { notesMaxLength } from "@/data/config";

export const clientsTable = pgTable(
  "client",
  {
    id: serial("id").primaryKey(),
    // Data fields
    name: varchar("name", { length: 64 }).notNull().unique(),
    registrationNumber: varchar("registration_number", { length: 64 }),
    website: varchar("website", { length: 256 }),
    notes: varchar("notes", { length: notesMaxLength }),

    isActive: boolean("is_active").notNull().default(true),

    primaryAddressId: integer("primary_address_id"),
    primaryContactId: integer("primary_contact_id"),

    // Interaction fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    createdBy: integer("created_by")
      .references(() => usersTable.id)
      .notNull(),
    updatedBy: integer("updated_by").references(() => usersTable.id),
  },
  (table) => ({
    clientsSearchIndex: index("clients_search_index").using(
      "gin",
      sql`to_tsvector('english', ${table.name})`,
    ),
  }),
);

export const clientRelations = relations(clientsTable, ({ many, one }) => ({
  contacts: many(contactsTable),
  addresses: many(addressesTable),
  documents: many(documentRelationsTable),
  creator: one(usersTable, {
    fields: [clientsTable.createdBy],
    references: [usersTable.id],
  }),
  updater: one(usersTable, {
    fields: [clientsTable.updatedBy],
    references: [usersTable.id],
  }),
  primaryAddress: one(addressesTable, {
    fields: [clientsTable.primaryAddressId],
    references: [addressesTable.id],
  }),
  primaryContact: one(contactsTable, {
    fields: [clientsTable.primaryContactId],
    references: [contactsTable.id],
  }),
}));

export const insertClientSchema = createInsertSchema(clientsTable);

export type InsertClientDataType = z.infer<typeof insertClientSchema>;

export const selectClientSchema = createSelectSchema(clientsTable);

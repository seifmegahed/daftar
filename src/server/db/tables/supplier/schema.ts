import type { z } from "zod";
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import {
  usersTable,
  addressesTable,
  contactsTable,
  documentRelationsTable,
} from "@/server/db/schema";
import { notesMaxLength } from "@/data/config";

export const suppliersTable = pgTable(
  "supplier",
  {
    id: serial("id").primaryKey(),
    // Data fields
    name: varchar("name", { length: 64 }).notNull().unique(),
    field: varchar("field", { length: 64 }).notNull(),
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
    suppliersSearchIndex: index("suppliers_search_index").using(
      "gin",
      sql`(
        setweight(to_tsvector('english', ${table.name}), 'A') ||
        setweight(to_tsvector('english', ${table.field}), 'B')
    )`,
    ),
  }),
);

export const supplierRelations = relations(suppliersTable, ({ many, one }) => ({
  contacts: many(contactsTable),
  addresses: many(addressesTable),
  documents: many(documentRelationsTable),
  creator: one(usersTable, {
    fields: [suppliersTable.createdBy],
    references: [usersTable.id],
  }),
  updater: one(usersTable, {
    fields: [suppliersTable.updatedBy],
    references: [usersTable.id],
  }),
  primaryAddress: one(addressesTable, {
    fields: [suppliersTable.primaryAddressId],
    references: [addressesTable.id],
  }),
  primaryContact: one(contactsTable, {
    fields: [suppliersTable.primaryContactId],
    references: [contactsTable.id],
  }),
}));

export const insertSupplierSchema = createInsertSchema(suppliersTable);
export const selectSupplierSchema = createSelectSchema(suppliersTable);

export type InsertSupplierType = z.infer<typeof insertSupplierSchema>;
export type SelectSupplierType = z.infer<typeof selectSupplierSchema>;

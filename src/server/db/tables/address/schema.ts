import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { suppliersTable } from "../supplier/schema";
import { clientsTable } from "../client/schema";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { notesMaxLength } from "@/data/config";

export const addressesTable = pgTable("address", {
  id: serial("id").primaryKey(),
  // Data fields
  name: varchar("name", { length: 64 }).notNull(),
  addressLine: varchar("address_line", { length: 256 }).notNull(),
  country: varchar("country", { length: 64 }).notNull(),
  city: varchar("city", { length: 64 }),
  notes: varchar("notes", { length: notesMaxLength }),

  /**
   * Foreign keys
   *
   * No hard constraints on these fields, they should be implemented on the
   * application-level.
   *
   * The cardinality of these fields should be 1:1
   * Either a supplier reference or a client reference should be present.
   *
   * No issue having both relations present, but I don't see a use case for
   * it.
   *
   * Having neither relation present is not a problem, but it's not ideal.
   * It depends on the application:
   *  - If the application is going to query addresses in a vacuum, it's fine.
   *  - If the application is only going to query addresses by a supplier or
   *    client, then not having a relation present is going to cause orphaned
   *    data.
   */
  supplierId: integer("supplier_id").references(() => suppliersTable.id),
  clientId: integer("client_id").references(() => clientsTable.id),

  // Interaction fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by").references(() => usersTable.id),
});

export const addressRelations = relations(addressesTable, ({ one }) => ({
  supplier: one(suppliersTable, {
    fields: [addressesTable.supplierId],
    references: [suppliersTable.id],
  }),
  client: one(clientsTable, {
    fields: [addressesTable.clientId],
    references: [clientsTable.id],
  }),
  creator: one(usersTable, {
    fields: [addressesTable.createdBy],
    references: [usersTable.id],
  }),
  updater: one(usersTable, {
    fields: [addressesTable.updatedBy],
    references: [usersTable.id],
  }),
}));

export const insertAddressSchemaRaw = createInsertSchema(addressesTable);
export const selectAddressSchema = createSelectSchema(addressesTable);

type InsertAddressTypeRaw = z.infer<typeof insertAddressSchemaRaw>;
export type SelectAddressType = z.infer<typeof selectAddressSchema>;

export const insertAddressSchemaRefineCallback = (
  data: Partial<InsertAddressTypeRaw>,
) => {
  /**
   * XOR Logic
   * Either a clientId or a supplierId must be present in the data.
   * If both are present, it's an error.
   * If neither are present, it's an error.
   */
  if (data.clientId && data.supplierId) return false;
  if (!data.clientId && !data.supplierId) return false;
  return true;
};

export const insertAddressSchema = insertAddressSchemaRaw.refine(
  insertAddressSchemaRefineCallback,
);

export type InsertAddressType = z.infer<typeof insertAddressSchema>;

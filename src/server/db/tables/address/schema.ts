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

export const addressesTable = pgTable("address", {
  id: serial("id").primaryKey(),
  // Data fields
  name: varchar("name", { length: 64 }).notNull(),
  addressLine: varchar("address_line", { length: 256 }).notNull(),
  country: varchar("country", { length: 64 }).notNull(),
  city: varchar("city", { length: 64 }),
  notes: varchar("notes", { length: 256 }),

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
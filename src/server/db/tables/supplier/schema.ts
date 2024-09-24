import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { relations } from "drizzle-orm";
import { contactsTable } from "../contact/schema";
import { addressesTable } from "../address/schema";

export const suppliersTable = pgTable("supplier", {
  id: serial("id").primaryKey(),
  // Data fields
  name: varchar("name", { length: 64 }).notNull(),
  field: varchar("field", { length: 64 }).notNull(),
  registrationNumber: varchar("registration_number", { length: 64 }),
  website: varchar("website", { length: 256 }),
  notes: varchar("notes", { length: 256 }),

  // Interaction fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by").references(() => usersTable.id),
});

export const supplierRelations = relations(suppliersTable, ({ many, one }) => ({
  contacts: many(contactsTable),
  addresses: many(addressesTable),
  creator: one(usersTable),
  updater: one(usersTable),
}));

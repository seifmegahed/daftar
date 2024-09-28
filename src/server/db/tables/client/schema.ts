import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import type { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { contactsTable } from "../contact/schema";
import { addressesTable } from "../address/schema";
import { documentRelationsTable } from "../document/schema";
import { notesMaxLength } from "@/data/config";

export const clientsTable = pgTable("client", {
  id: serial("id").primaryKey(),
  // Data fields
  name: varchar("name", { length: 64 }).notNull().unique(),
  registrationNumber: varchar("registration_number", { length: 64 }),
  website: varchar("website", { length: 64 }),
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
});

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

// export const clientSchemaRaw = {
//   id: z.number(),
//   name: z
//     .string({ required_error: "Name is required" })
//     .min(4, { message: "Name must be at least 4 characters" })
//     .max(64, { message: "Name must not be longer than 64 characters" }),
//   registrationNumber: z
//     .string()
//     .max(64, {
//       message: "Registration number must not be longer than 64 characters",
//     })
//     .nullable(),
//   website: z
//     .string()
//     .max(64, { message: "Website must not be longer than 64 characters" })
//     .nullable(),
//   notes: z
//     .string()
//     .max(notesMaxLength, { message: "Notes must not be longer than 256 characters" })
//     .nullable(),

//   createdAt: z.date(),
//   updatedAt: z.date().nullable(),
//   createdBy: z.number(),
//   updatedBy: z.number().nullable(),
// };

// export const clientSchema = z.object(clientSchemaRaw);

// export type ClientDataType = z.infer<typeof clientSchema>;

export const insertClientSchema = createInsertSchema(clientsTable);

export type InsertClientDataType = z.infer<typeof insertClientSchema>;

export const selectClientSchema = createSelectSchema(clientsTable);

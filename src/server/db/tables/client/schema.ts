import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const clientsTable = pgTable("client", {
  id: serial("id").primaryKey(),
  // Data fields
  name: varchar("name", { length: 64 }).notNull().unique(),
  registrationNumber: varchar("registration_number", { length: 64 }),
  website: varchar("website", { length: 64 }),
  notes: varchar("notes", { length: 256 }),

  isActive: boolean("is_active").notNull().default(true),

  // Interaction fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by").references(() => usersTable.id),
});

export const clientSchemaRaw = {
  id: z.number(),
  name: z
    .string({ required_error: "Name is required" })
    .min(4, { message: "Name must be at least 4 characters" })
    .max(64, { message: "Name must not be longer than 64 characters" }),
  registrationNumber: z
    .string()
    .max(64, {
      message: "Registration number must not be longer than 64 characters",
    })
    .nullable(),
  website: z
    .string()
    .max(64, { message: "Website must not be longer than 64 characters" })
    .nullable(),
  notes: z
    .string()
    .max(256, { message: "Notes must not be longer than 256 characters" })
    .nullable(),

  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdBy: z.number(),
  updatedBy: z.number().nullable(),
};

export const clientSchema = z.object(clientSchemaRaw);

export type ClientDataType = z.infer<typeof clientSchema>;

export const insertClientSchema = createInsertSchema(clientsTable);

export const selectClientSchema = createSelectSchema(clientsTable);


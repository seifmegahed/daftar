import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { clientsTable } from "../client/schema";

export const usersTable = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  role: varchar("role", { length: 32 }).default("user").notNull(),
  active: boolean("active").notNull().default(true),
  // Salted password
  password: varchar("password", { length: 128 }).notNull(),
  // timestamps
  createdAt: timestamp("created_at").default(new Date()).notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  lastActive: timestamp("last_active"),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  clients: many(clientsTable),
}));

export const UserSchemaRaw = {
  id: z.number(),
  name: z
    .string({ required_error: "Name is required" })
    .min(4, { message: "Name must be at least 4 character" })
    .max(64, { message: "Name must be at most 64 characters" }),
  username: z
    .string({ required_error: "Username is required" })
    .min(5, { message: "Username must be at least 5 characters" })
    .max(64, { message: "Username must be at most 64 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be at most 64 characters" }),
  verifyPassword: z.string(),
  role: z
    .string({ required_error: "Role is required" })
    .max(32)
    .default("user"),
  active: z.boolean(),
  createdAt: z.date(),
  lastActive: z.date().nullable(),
  updatedAt: z.date().nullable(),
};

export const UserSchema = z.object(UserSchemaRaw);

export type UserDataType = z.infer<typeof UserSchema>;

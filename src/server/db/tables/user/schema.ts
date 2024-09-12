import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }).notNull(),
  role: varchar("role", { length: 32 }).default("user").notNull(),
});

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().max(64, { message: "Name must be at most 64 characters" }),
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" })
    .max(64, { message: "Username must be at most 64 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(64, { message: "Password must be at most 64 characters" }),
  verifyPassword: z.string().min(8).max(64),
  role: z.string().max(32).default("user"),
});

export type UserDataType = z.infer<typeof UserSchema>;

import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }).notNull(),
  role: varchar("role", { length: 32 }).default("user").notNull(),
});

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
  verifyPassword: z.string().min(8).max(64),
  role: z
    .string({ required_error: "Role is required" })
    .max(32)
    .default("user"),
};

export const UserSchema = z.object(UserSchemaRaw);

export type UserDataType = z.infer<typeof UserSchema>;

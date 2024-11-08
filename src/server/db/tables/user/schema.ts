import {
  boolean,
  index,
  pgTable,
  serial,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const usersTable = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
    username: varchar("username", { length: 64 }).notNull().unique(),

    email: varchar("email", { length: 64 })
      .notNull()
      .default("john-doe@example.com"), // Should be unique in production
    phoneNumber: varchar("phone_number", { length: 64 })
      .notNull()
      .default("+20 123 456 7890"), // Should be unique in production

    role: varchar("role", { length: 32 }).default("user").notNull(),
    active: boolean("active").notNull().default(true),

    wrongAttempts: smallint("wrong_attempts").default(0).notNull(),
    lockedUntil: timestamp("locked_until"),
    // Salted password
    password: varchar("password", { length: 128 }).notNull(),
    // timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
    lastActive: timestamp("last_active"),
  },
  (table) => ({
    usernameIndex: index("username_index").on(table.username),
  }),
);

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
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid email" })
    .max(64, { message: "Email must be at most 64 characters" })
    .default("john-doe@example.com")
    .optional(),
  phoneNumber: z
    .string({ required_error: "Phone Number is required" })
    .max(64, { message: "Phone Number must be at most 64 characters" })
    .default("+20 123 456 7890")
    .optional(),
  lockedUntil: z.date().nullable(),
  wrongAttempts: z.number(),
};

export const UserSchema = z.object(UserSchemaRaw);

export type UserDataType = z.infer<typeof UserSchema>;

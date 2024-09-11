import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }).notNull(),
  role: varchar("role", { length: 256 }).default("user"),
});

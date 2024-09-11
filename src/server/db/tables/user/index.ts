import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  username: varchar("username", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  role: varchar("role", { length: 256 }).default("user"),
});

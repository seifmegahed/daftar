import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "../user";

export const sessions = pgTable("session", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .unique()
    .notNull()
    .references(() => users.id),
  token: varchar("token", { length: 256 }).unique().notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  expiresAt: timestamp("expires_at").notNull(),
});

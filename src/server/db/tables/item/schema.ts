import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";

export const itemsTable = pgTable("item", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  type: varchar("type", { length: 64 }),
  description: varchar("description", { length: 256 }),
  mpn: varchar("mpn", { length: 64 }),
  make: varchar("make", { length: 64 }),
  notes: varchar("notes", { length: 256 }),

  // Interaction fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by").references(() => usersTable.id),
});

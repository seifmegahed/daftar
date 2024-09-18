import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { clientsTable } from "../client/schema";
import { itemsTable } from "../item/schema";
import { suppliersTable } from "../supplier/schema";

export const projectsTable = pgTable("project", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  status: integer("status").notNull(),
  description: varchar("description", { length: 256 }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  notes: varchar("notes", { length: 256 }),

  // Foreign keys
  client: integer("client")
    .references(() => clientsTable.id)
    .notNull(),
  owner: integer("owner")
    .references(() => usersTable.id)
    .notNull(),

  // Interaction fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  createdBy: integer("created_by")
    .references(() => usersTable.id)
    .notNull(),
  updatedBy: integer("updated_by").references(() => usersTable.id),
});

export const projectItemsTable = pgTable("project_items", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projectsTable.id).notNull(),
  itemId: integer("item_id").references(() => itemsTable.id).notNull(),
  supplierId: integer("supplier_id").references(() => suppliersTable.id),
  price: numeric("price").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  quantity: integer("quantity").notNull(),
});
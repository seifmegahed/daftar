import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "../user/schema";
import { projectsTable } from "../project/schema";
import { itemsTable } from "../item/schema";
import { suppliersTable } from "../supplier/schema";
import { clientsTable } from "../client/schema";

export const documentsTable = pgTable("document", { 
  id: serial("id").primaryKey(),
  // Data fields
  name: varchar("name", { length: 64 }).notNull(),
  path: varchar("path", { length: 256 }).notNull(),
  notes: varchar("notes", { length: 256 }),

  // Interaction fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => usersTable.id).notNull(),
});



/**
 * XOR Safe-guarded type for document relations
 * 
 * This type is used to define the relations between documents, projects, items, suppliers, and clients.
 * It is used to ensure that the relations are one of the following:
 *  - project
 *  - item
 *  - supplier
 *  - client
 */
export type DocumentRelationsType = {id: number, documentId: number} & (
  | { projectId: number }
  | { itemId: number }
  | { supplierId: number }
  | { clientId: number }
);

export const documentRelationsTable = pgTable("document_relations", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documentsTable.id).notNull(),
  projectId: integer("project_id").references(() => projectsTable.id),
  itemId: integer("item_id").references(() => itemsTable.id),
  supplierId: integer("supplier_id").references(() => suppliersTable.id),
  clientId: integer("client_id").references(() => clientsTable.id),
});
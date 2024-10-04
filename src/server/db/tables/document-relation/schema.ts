import { relations } from "drizzle-orm";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import {
  projectsTable,
  itemsTable,
  suppliersTable,
  clientsTable,
  documentsTable,
} from "@/server/db/schema";

import { isExactlyOneDefined } from "@/utils/common";

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
type RelationsTypeUnion =
  | { projectId: number; itemId: null; supplierId: null; clientId: null }
  | { projectId: null; itemId: number; supplierId: null; clientId: null }
  | { projectId: null; itemId: null; supplierId: number; clientId: null }
  | { projectId: null; itemId: null; supplierId: null; clientId: number };

export type DocumentRelationsType = {
  id?: number;
  documentId: number;
} & RelationsTypeUnion;

export const documentRelationsTable = pgTable("document_relations", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id")
    .references(() => documentsTable.id)
    .notNull(),
  projectId: integer("project_id").references(() => projectsTable.id),
  itemId: integer("item_id").references(() => itemsTable.id),
  supplierId: integer("supplier_id").references(() => suppliersTable.id),
  clientId: integer("client_id").references(() => clientsTable.id),
});

export const documentRelationsRelations = relations(
  documentRelationsTable,
  ({ one }) => ({
    document: one(documentsTable, {
      fields: [documentRelationsTable.documentId],
      references: [documentsTable.id],
    }),
    project: one(projectsTable, {
      fields: [documentRelationsTable.projectId],
      references: [projectsTable.id],
    }),
    item: one(itemsTable, {
      fields: [documentRelationsTable.itemId],
      references: [itemsTable.id],
    }),
    supplier: one(suppliersTable, {
      fields: [documentRelationsTable.supplierId],
      references: [suppliersTable.id],
    }),
    client: one(clientsTable, {
      fields: [documentRelationsTable.clientId],
      references: [clientsTable.id],
    }),
  }),
);

export const documentRelationsSchema = createInsertSchema(
  documentRelationsTable,
)
  .omit({ documentId: true })
  .refine((data) => {
    const { projectId, itemId, supplierId, clientId } = data;
    return isExactlyOneDefined({ projectId, itemId, supplierId, clientId });
  });

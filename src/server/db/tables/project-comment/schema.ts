import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { projectsTable } from "../project/schema";
import { usersTable } from "../user/schema";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const projectCommentsTable = pgTable(
  "project_comment",
  {
    id: serial("id").primaryKey(),

    projectId: serial("project_id")
      .notNull()
      .references(() => projectsTable.id),
    text: varchar("text", { length: 256 }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: integer("created_by")
      .notNull()
      .references(() => usersTable.id),
  },
  (table) => ({
    projectIdIndex: index("project_id_index").on(table.projectId),
  }),
);

export const projectCommentsRelations = relations(
  projectCommentsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectCommentsTable.projectId],
      references: [projectsTable.id],
    }),
    creator: one(usersTable, {
      fields: [projectCommentsTable.createdBy],
      references: [usersTable.id],
    }),
  }),
);

export const insertProjectCommentSchema =
  createInsertSchema(projectCommentsTable);

export type InsertProjectCommentType = z.infer<
  typeof insertProjectCommentSchema
>;

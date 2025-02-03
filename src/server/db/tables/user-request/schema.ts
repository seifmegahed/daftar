import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const userRequestTable = pgTable("user_request", {
  id: uuid("id").defaultRandom().notNull(),
  email: varchar("email", { length: 64 }).notNull(),
  username: varchar("username", { length: 64 }).notNull(),
  name: varchar("name", { length: 64 }).notNull(),
  password: varchar("password", { length: 128 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: boolean("status").default(false).notNull(),
});

import { eq, not, sql } from "drizzle-orm";
import { documentsTable } from "./schema";

export const privateFilterQuery = (accessToPrivate: boolean) =>
  !accessToPrivate ? not(eq(documentsTable.private, true)) : sql`true`;

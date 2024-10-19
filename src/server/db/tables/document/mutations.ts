import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";

import { documentsTable } from "./schema";
import { privateFilterQuery } from "./utils";

import { errorLogger } from "@/lib/exceptions";

import type { DocumentDataType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Document Mutations Error:",
  insert: "An error occurred while adding document",
  update: "And error occurred while updating document",
  delete: "An error occurred while deleting document",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertDocument = async (
  data: DocumentDataType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [document] = await db.insert(documentsTable).values(data).returning();
    if (!document) return [null, errorMessage];

    return [document.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const updateDocument = async (
  id: number,
  data: Partial<DocumentDataType>,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [document] = await db
      .update(documentsTable)
      .set(data)
      .where(
        and(eq(documentsTable.id, id), privateFilterQuery(accessToPrivate)),
      )
      .returning();

    if (!document) return [null, errorMessage];
    return [document.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteDocument = async (
  id: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [document] = await db
      .delete(documentsTable)
      .where(
        and(eq(documentsTable.id, id), privateFilterQuery(accessToPrivate)),
      )
      .returning();

    if (!document) return [null, errorMessage];
    return [document.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

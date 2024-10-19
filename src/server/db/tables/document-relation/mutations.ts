import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { documentRelationsTable, documentsTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { DocumentDataType } from "@/server/db/tables/document/schema";
import type { DocumentRelationsType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Document Relations Mutations Error:",
  insert: "An error occurred while adding document",
  update: "And error occurred while updating document",
  delete: "An error occurred while deleting document",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertDocumentRelation = async (
  relation: DocumentRelationsType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [result] = await db
      .insert(documentRelationsTable)
      .values(relation)
      .returning();

    if (!result) return [null, errorMessage];
    return [result.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const insertDocumentWithRelation = async (
  document: DocumentDataType,
  relation: Omit<DocumentRelationsType, "documentId">,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const documentId = await db.transaction(async (tx) => {
      const [documentResult] = await tx
        .insert(documentsTable)
        .values(document)
        .returning();
      if (!documentResult) return undefined;
      await tx
        .insert(documentRelationsTable)
        .values({ ...relation, documentId: documentResult.id })
        .returning();

      return documentResult.id;
    });

    if (!documentId) return [null, errorMessage];
    return [documentId, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteDocumentRelation = async (
  relationId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [result] = await db
      .delete(documentRelationsTable)
      .where(eq(documentRelationsTable.id, relationId))
      .returning();
    if (!result) return [null, errorMessage];
    return [result.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

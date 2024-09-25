import { db } from "@/server/db";
import {
  documentRelationsTable,
  documentsTable,
  type DocumentDataType,
  type DocumentRelationsType,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const insertDocumentWithRelation = async (
  document: DocumentDataType,
  relation: Omit<DocumentRelationsType, "documentId">,
): Promise<ReturnTuple<number>> => {
  const documentId = await db.transaction(async (tx) => {
    const [documentResult] = await tx
      .insert(documentsTable)
      .values(document)
      .returning({ id: documentsTable.id });
    if (!documentResult) return undefined;
    await tx
      .insert(documentRelationsTable)
      .values({ ...relation, documentId: documentResult.id })
      .returning({ id: documentRelationsTable.id });

    return documentResult.id;
  });
  if (!documentId) return [null, "Error inserting document"];
  return [documentId, null];
};

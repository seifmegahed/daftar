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
  try {
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
  } catch (error) {
    console.log(error);
    return [null, "Error inserting document"];
  }
};

export const getClientDocuments = async (
  clientId: number,
): Promise<ReturnTuple<Pick<DocumentDataType, "id" | "name">[]>> => {
  try {
    const documents = await db.query.documentRelationsTable.findMany({
      where: (documentRelation, { eq }) =>
        eq(documentRelation.clientId, clientId),
      columns: {},
      with: {
        document: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!documents) return [null, "Error getting client documents"];

    return [documents.map((x) => x.document), null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting client documents"];
  }
};

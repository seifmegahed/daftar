import { count, eq } from "drizzle-orm";
import { db } from "@/server/db";

import { documentRelationsTable } from "./schema";
import { documentsTable } from "@/server/db/schema";

import type { DocumentRelationsType } from "./schema";
import type { DocumentDataType } from "@/server/db/tables/document/schema";
import type { SimpDoc } from "@/server/db/tables/document/queries";
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
): Promise<ReturnTuple<SimpDoc[]>> => {
  try {
    const documents = await db.query.documentRelationsTable.findMany({
      where: (documentRelation, { eq }) =>
        eq(documentRelation.clientId, clientId),
      columns: { id: true },
      with: {
        document: {
          columns: {
            id: true,
            name: true,
            extension: true,
          },
        },
      },
    });
    if (!documents) return [null, "Error getting client documents"];

    return [documents.map((x) => ({ ...x.document, relationId: x.id })), null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting client documents"];
  }
};

export const getSupplierDocuments = async (
  supplierId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  try {
    const documents = await db.query.documentRelationsTable.findMany({
      where: (documentRelation, { eq }) =>
        eq(documentRelation.supplierId, supplierId),
      columns: { id: true },
      with: {
        document: {
          columns: {
            id: true,
            name: true,
            extension: true,
          },
        },
      },
    });
    if (!documents) return [null, "Error getting supplier documents"];

    return [documents.map((x) => ({ ...x.document, relationId: x.id })), null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting supplier documents"];
  }
};

export const getItemDocuments = async (
  itemId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  try {
    const documents = await db.query.documentRelationsTable.findMany({
      where: (documentRelation, { eq }) => eq(documentRelation.itemId, itemId),
      columns: { id: true },
      with: {
        document: {
          columns: {
            id: true,
            name: true,
            extension: true,
          },
        },
      },
    });
    if (!documents) return [null, "Error getting item documents"];

    return [documents.map((x) => ({ ...x.document, relationId: x.id })), null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting item documents"];
  }
};

export const getProjectDocuments = async (
  projectId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  try {
    const documents = await db.query.documentRelationsTable.findMany({
      where: (documentRelation, { eq }) =>
        eq(documentRelation.projectId, projectId),
      columns: { id: true },
      with: {
        document: {
          columns: {
            id: true,
            name: true,
            extension: true,
          },
        },
      },
    });
    if (!documents) return [null, "Error getting project documents"];
    return [documents.map((x) => ({ ...x.document, relationId: x.id })), null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project documents"];
  }
};

export const deleteDocumentRelation = async (
  relationId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .delete(documentRelationsTable)
      .where(eq(documentRelationsTable.id, relationId))
      .returning({ id: documentRelationsTable.id });
    if (!result) return [null, "Error deleting document relation"];
    return [result.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error deleting document relation"];
  }
};

export const getDocumentRelationsCount = async (id: number): Promise<
  ReturnTuple<number>
> => {
  try {
    const [result] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.documentId, id))
      .limit(1);
    if (!result) return [null, "Error getting document relations count"];
    return [result.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document relations count"];
  }
};

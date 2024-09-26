import { db } from "@/server/db";
import {
  documentRelationsTable,
  documentsTable,
  type DocumentDataType,
  type DocumentRelationsType,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const insertDocument = async (
  data: DocumentDataType,
): Promise<ReturnTuple<number>> => {
  try {
    const [document] = await db
      .insert(documentsTable)
      .values(data)
      .returning({ id: documentsTable.id });

    if (!document) return [null, "Error inserting new document"];
    return [document.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error inserting new document"];
  }
};

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

export type SimpDoc = Pick<DocumentDataType, "id" | "name" | "extension">;

export const getClientDocuments = async (
  clientId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
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
            extension: true,
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

export const getSupplierDocuments = async (
  supplierId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  try {
    const documents = await db.query.documentRelationsTable.findMany({
      where: (documentRelation, { eq }) =>
        eq(documentRelation.supplierId, supplierId),
      columns: {},
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

    return [documents.map((x) => x.document), null];
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
      columns: {},
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

    return [documents.map((x) => x.document), null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting item documents"];
  }
};

// TODO: Implement getProjectDocuments

export const getDocuments = async (): Promise<ReturnTuple<SimpDoc[]>> => {
  try {
    const documents = await db
      .select({
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
      })
      .from(documentsTable);
    if (!documents) return [null, "Error getting documents"];

    return [documents, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting documents"];
  }
};

type UserDataType = {
  id: number;
  name: string;
};

export type DocumentType = DocumentDataType & {
  creator: UserDataType;
};

export const getDocumentById = async (
  id: number,
): Promise<ReturnTuple<DocumentType>> => {
  try {
    const document = await db.query.documentsTable.findFirst({
      where: (document, { eq }) => eq(document.id, id),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!document) return [null, "Error getting document"];
    return [document, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document"];
  }
};

import { db } from "@/server/db";
import { count, eq, desc, sql } from "drizzle-orm";

import { documentsTable, type DocumentDataType } from "./schema";

import { getErrorMessage } from "@/lib/exceptions";
import { prepareSearchText } from "@/utils/common";
import { defaultPageLimit } from "@/data/config";

import type { ReturnTuple } from "@/utils/type-utils";

export type SimpDoc = {
  id: number;
  name: string;
  extension: string;
  path?: string;
  relationId?: number;
  createdAt?: Date;
};

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

const documentSearchQuery = (searchText: string) =>
  sql`
    (
      setweight(to_tsvector('english', ${documentsTable.name}), 'A') ||
      setweight(to_tsvector('english', ${documentsTable.extension}), 'B')
    ), to_tsquery(${prepareSearchText(searchText)})
  `;

export type BriefDocumentType = Required<
  Pick<SimpDoc, "id" | "name" | "extension" | "createdAt">
>;

export const getDocuments = async (
  page: number,
  searchText?: string,
  limit = defaultPageLimit,
): Promise<ReturnTuple<BriefDocumentType[]>> => {
  try {
    const documents = await db
      .select({
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
        createdAt: documentsTable.createdAt,
        rank: searchText
          ? sql`ts_rank(${documentSearchQuery(searchText)})`
          : sql`1`,
      })
      .from(documentsTable)
      .orderBy((table) =>
        searchText ? desc(table.rank) : desc(documentsTable.id),
      )
      .limit(limit)
      .offset((page - 1) * limit);

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
): Promise<ReturnTuple<Required<DocumentType>>> => {
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

export const getDocumentPath = async (
  id: number,
): Promise<ReturnTuple<{ name: string; path: string; extension: string }>> => {
  try {
    const [path] = await db
      .select({
        name: documentsTable.name,
        path: documentsTable.path,
        extension: documentsTable.extension,
      })
      .from(documentsTable)
      .where(eq(documentsTable.id, id))
      .limit(1);

    if (!path) return [null, "Error getting document path"];
    return [path, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document path"];
  }
};

export const getDocumentsCount = async (): Promise<ReturnTuple<number>> => {
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentsTable)
      .limit(1);

    if (!documents) return [null, "Error getting documents count"];
    return [documents.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateDocument = async (
  id: number,
  data: Partial<DocumentDataType>,
): Promise<ReturnTuple<number>> => {
  try {
    const [document] = await db
      .update(documentsTable)
      .set(data)
      .where(eq(documentsTable.id, id))
      .returning({ id: documentsTable.id });

    if (!document) return [null, "Error updating document"];
    return [document.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const deleteDocument = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [document] = await db
      .delete(documentsTable)
      .where(eq(documentsTable.id, id))
      .returning({ id: documentsTable.id });

    if (!document) return [null, "Error deleting document"];
    return [document.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getDocumentOptions = async (): Promise<
  ReturnTuple<Pick<SimpDoc, "id" | "name" | "extension">[]>
> => {
  try {
    const documents = await db
      .select({
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
      })
      .from(documentsTable)
      .orderBy(desc(documentsTable.name));

    if (!documents) return [null, "Error getting documents"];
    return [documents, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting documents"];
  }
};

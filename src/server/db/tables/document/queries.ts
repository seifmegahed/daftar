import { db } from "@/server/db";
import { count, eq, desc, sql, and, not } from "drizzle-orm";

import { documentsTable } from "./schema";
import type { DocumentDataType } from "./schema";

import { getErrorMessage } from "@/lib/exceptions";
import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";
import { defaultPageLimit } from "@/data/config";
import { filterDefault } from "@/components/filter-and-search";

import type { ReturnTuple } from "@/utils/type-utils";
import type { FilterArgs } from "@/components/filter-and-search";

export type SimpDoc = {
  id: number;
  name: string;
  extension: string;
  private?: boolean | null;
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

const documentFilterQuery = (filter: FilterArgs) => {
  switch (filter.filterType) {
    case "creationDate":
      return timestampQueryGenerator(
        documentsTable.createdAt,
        filter.filterValue,
      );
    default:
      return sql`true`;
  }
};

const documentSearchQuery = (searchText: string) =>
  sql`
    (
      setweight(to_tsvector('english', ${documentsTable.name}), 'A') ||
      setweight(to_tsvector('english', ${documentsTable.extension}), 'B')
    ), to_tsquery(${prepareSearchText(searchText)})
  `;

export const privateFilterQuery = (accessToPrivate: boolean) =>
  !accessToPrivate
    ? not(eq(documentsTable.private, true))
    : sql`true`;

export type BriefDocumentType = Required<
  Pick<SimpDoc, "id" | "name" | "extension" | "createdAt" | "private">
>;

export const getDocuments = async (
  page: number,
  filter: FilterArgs = filterDefault,
  searchText?: string,
  accessToPrivate = false,
  limit = defaultPageLimit,
): Promise<ReturnTuple<BriefDocumentType[]>> => {
  try {
    const documents = await db
      .select({
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
        createdAt: documentsTable.createdAt,
        private: documentsTable.private,
        rank: searchText
          ? sql`ts_rank(${documentSearchQuery(searchText)})`
          : sql`1`,
      })
      .from(documentsTable)
      .where(
        and(documentFilterQuery(filter), privateFilterQuery(accessToPrivate)),
      )
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
  accessToPrivate = false,
): Promise<ReturnTuple<Required<DocumentType>>> => {
  try {
    const document = await db.query.documentsTable.findFirst({
      where: (document, { eq, and }) =>
        and(eq(document.id, id), privateFilterQuery(accessToPrivate)),
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
  accessToPrivate = false,
): Promise<ReturnTuple<{ name: string; path: string; extension: string }>> => {
  try {
    const [path] = await db
      .select({
        name: documentsTable.name,
        path: documentsTable.path,
        extension: documentsTable.extension,
      })
      .from(documentsTable)
      .where(
        and(eq(documentsTable.id, id), privateFilterQuery(accessToPrivate)),
      )
      .limit(1);

    if (!path) return [null, "Error getting document path"];
    return [path, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document path"];
  }
};

export const getDocumentsCount = async (
  filter: FilterArgs = filterDefault,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentsTable)
      .where(
        and(documentFilterQuery(filter), privateFilterQuery(accessToPrivate)),
      )
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
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [document] = await db
      .update(documentsTable)
      .set(data)
      .where(
        and(eq(documentsTable.id, id), privateFilterQuery(accessToPrivate)),
      )
      .returning({ id: documentsTable.id });

    if (!document) return [null, "Error updating document"];
    return [document.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const deleteDocument = async (
  id: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [document] = await db
      .delete(documentsTable)
      .where(
        and(eq(documentsTable.id, id), privateFilterQuery(accessToPrivate)),
      )
      .returning({ id: documentsTable.id });

    if (!document) return [null, "Error deleting document"];
    return [document.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getDocumentOptions = async (
  accessToPrivate = false,
): Promise<ReturnTuple<Pick<SimpDoc, "id" | "name" | "extension">[]>> => {
  try {
    const documents = await db
      .select({
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
      })
      .from(documentsTable)
      .where(privateFilterQuery(accessToPrivate))
      .orderBy(desc(documentsTable.name));

    if (!documents) return [null, "Error getting documents"];
    return [documents, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting documents"];
  }
};

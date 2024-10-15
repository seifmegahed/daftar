import { db } from "@/server/db";
import { count, eq, desc, sql, and, not } from "drizzle-orm";

import { documentsTable } from "./schema";
import type { DocumentDataType } from "./schema";

import { errorLogger } from "@/lib/exceptions";
import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";
import { defaultPageLimit } from "@/data/config";
import { filterDefault } from "@/components/filter-and-search";

import type { ReturnTuple } from "@/utils/type-utils";
import type { FilterArgs } from "@/components/filter-and-search";

const errorMessages = {
  mainTitle: "Document Queries Error:",
  insert: "An error occurred while adding document",
  update: "And error occurred while updating document",
  delete: "An error occurred while deleting document",
  getDocument: "An error occurred while getting document",
  getDocuments: "An error occurred while getting documents",
  getPath: "An error occurred while getting document path",
  count: "An error occurred while counting documents",
  dataCorrupted: "It seems that some data is corrupted",
};

const logError = errorLogger(errorMessages.mainTitle);

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
  !accessToPrivate ? not(eq(documentsTable.private, true)) : sql`true`;

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
  const errorMessage = errorMessages.getDocuments;
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

    if (!documents) return [null, errorMessage];

    return [documents, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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
  const errorMessage = errorMessages.getDocument;
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

    if (!document) return [null, errorMessage];
    return [document, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getDocumentPath = async (
  id: number,
  accessToPrivate = false,
): Promise<ReturnTuple<{ name: string; path: string; extension: string }>> => {
  const errorMessage = errorMessages.getPath;
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

    if (!path) return [null, errorMessage];
    return [path, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getDocumentsCount = async (
  filter: FilterArgs = filterDefault,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentsTable)
      .where(
        and(documentFilterQuery(filter), privateFilterQuery(accessToPrivate)),
      )
      .limit(1);

    if (!documents) return [null, errorMessage];
    return [documents.count, null];
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

export const getDocumentOptions = async (
  accessToPrivate = false,
): Promise<ReturnTuple<Pick<SimpDoc, "id" | "name" | "extension">[]>> => {
  const errorMessage = errorMessages.getDocuments;
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

    if (!documents) return [null, errorMessage];
    return [documents, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

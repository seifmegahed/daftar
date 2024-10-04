"use server";

import {
  getDocumentById,
  getDocuments,
  getDocumentsCount,
} from "@/server/db/tables/document/queries";
import type {
  BriefDocumentType,
  DocumentType,
} from "@/server/db/tables/document/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const getDocumentsAction = async (
  page: number,
  searchText?: string,
  limit?: number,
): Promise<ReturnTuple<BriefDocumentType[]>> => {
  const [documents, documentsError] = await getDocuments(
    page,
    searchText,
    limit,
  );
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getDocumentByIdAction = async (
  id: number,
): Promise<ReturnTuple<Required<DocumentType>>> => {
  const [document, documentError] = await getDocumentById(id);
  if (documentError !== null) return [null, documentError];
  return [document, null];
};

export const getDocumentsCountAction = async (): Promise<
  ReturnTuple<number>
> => {
  const [documents, documentsError] = await getDocumentsCount();
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

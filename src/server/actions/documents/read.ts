"use server";

import {
  getDocumentById,
  getDocumentOptions,
  getDocuments,
  getDocumentsCount,
} from "@/server/db/tables/document/queries";

import type {
  BriefDocumentType,
  DocumentType,
} from "@/server/db/tables/document/queries";
import type { FilterArgs } from "@/components/filter-and-search";
import type { ReturnTuple } from "@/utils/type-utils";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";

export const getDocumentsAction = async (
  page: number,
  filter?: FilterArgs,
  searchText?: string,
  limit?: number,
): Promise<ReturnTuple<BriefDocumentType[]>> => {
  const [access, accessError] = await hasAccessToPrivateDataAction();
  if (accessError !== null) return [null, accessError];
  const [documents, documentsError] = await getDocuments(
    page,
    filter,
    searchText,
    access,
    limit,
  );
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getDocumentByIdAction = async (
  id: number,
): Promise<ReturnTuple<Required<DocumentType>>> => {
  const [access, accessError] = await hasAccessToPrivateDataAction();
  if (accessError !== null) return [null, accessError];
  const [document, documentError] = await getDocumentById(id, access);
  if (documentError !== null) return [null, documentError];
  return [document, null];
};

export const getDocumentsCountAction = async (
  filter?: FilterArgs,
): Promise<ReturnTuple<number>> => {
  const [access, accessError] = await hasAccessToPrivateDataAction();
  if (accessError !== null) return [null, accessError];
  const [documents, documentsError] = await getDocumentsCount(filter, access);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getDocumentOptionsAction = async (): Promise<
  ReturnTuple<Pick<BriefDocumentType, "id" | "name" | "extension">[]>
> => {
  const [documents, documentsError] = await getDocumentOptions();
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

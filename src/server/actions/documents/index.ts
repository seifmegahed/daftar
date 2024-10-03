"use server";

import { getErrorMessage } from "@/lib/exceptions";
import {
  deleteDocumentRelation,
  getClientDocuments,
  getDocumentById,
  getDocuments,
  getDocumentsCount,
  getItemDocuments,
  getProjectDocuments,
  getSupplierDocuments,
  type BriefDocumentType,
  type DocumentType,
  type SimpDoc,
} from "@/server/db/tables/document/queries";
import type { ReturnTuple } from "@/utils/type-utils";

import fs from "fs";

/**
 * Storage path for documents
 *
 * This path is relative to the root directory of the project.
 * It is used to store the uploaded documents.
 */
const storagePath = ".local-storage/documents";

export const saveDocumentFile = async (
  file: File,
): Promise<ReturnTuple<string>> => {
  const path = `${storagePath}/${file.name}`;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath);
    }

    if (fs.existsSync(path)) {
      return [null, "File already exists"];
    }

    fs.writeFileSync(path, buffer);
    return [path, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getClientDocumentsAction = async (
  clientId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getClientDocuments(clientId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getClientDocumentsCountAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [documents, countError] = await getClientDocuments(clientId);
  if (countError !== null) return [null, countError];
  return [documents.length, null];
};

export const getSupplierDocumentsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getSupplierDocuments(supplierId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getSupplierDocumentsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [documents, countError] = await getSupplierDocuments(supplierId);
  if (countError !== null) return [null, countError];
  return [documents.length, null];
};

export const getItemDocumentsAction = async (
  itemId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getItemDocuments(itemId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getProjectDocumentsAction = async (
  projectId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getProjectDocuments(projectId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getProjectDocumentsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [documents, countError] = await getProjectDocuments(projectId);
  if (countError !== null) return [null, countError];
  return [documents.length, null];
};

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
): Promise<ReturnTuple<DocumentType>> => {
  const [document, documentError] = await getDocumentById(id);
  if (documentError !== null) return [null, documentError];
  return [document, null];
};

export const unlinkDocumentAction = async (
  relationId: number,
): Promise<ReturnTuple<number>> => {
  const [deleted, deleteError] = await deleteDocumentRelation(relationId);
  if (deleteError !== null) return [null, deleteError];
  return [deleted, null];
};

export const getDocumentsCountAction = async (): Promise<
  ReturnTuple<number>
> => {
  const [documents, documentsError] = await getDocumentsCount();
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

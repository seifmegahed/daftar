"use server";

import { getErrorMessage } from "@/lib/exceptions";
import {
  getClientDocuments,
  getDocumentById,
  getDocuments,
  getItemDocuments,
  getSupplierDocuments,
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

export const getSupplierDocumentsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getSupplierDocuments(supplierId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getItemDocumentsAction = async (
  itemId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getItemDocuments(itemId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

// TODO: Implement getProjectDocumentsAction

export const getDocumentsAction = async (): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getDocuments();
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

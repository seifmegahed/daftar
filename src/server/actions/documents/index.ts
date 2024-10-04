"use server";

import { getErrorMessage } from "@/lib/exceptions";
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

export const getDocumentsCountAction = async (): Promise<
  ReturnTuple<number>
> => {
  const [documents, documentsError] = await getDocumentsCount();
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

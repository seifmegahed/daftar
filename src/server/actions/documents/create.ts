"use server";

import fs from "fs";

import { getErrorMessage } from "@/lib/exceptions";
import type { ReturnTuple } from "@/utils/type-utils";
import { env } from "@/env";


/**
 * Storage path for documents
 *
 * This path is relative to the root directory of the project.
 * It is used to store the uploaded documents.
 */
const rootPath = ".local-storage";
const storagePath = ".local-storage/documents";
const fakePath = ".local-storage/documents/sample-document.pdf";

export const saveDocumentFile = async (
  file: File,
): Promise<ReturnTuple<string>> => {
  const path = `${storagePath}/${file.name}`;
  try {
    if(env.NEXT_PUBLIC_VERCEL) {
      return [fakePath, null];
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath);
    }

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
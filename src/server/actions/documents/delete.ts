"use server";

import { deleteDocument } from "@/server/db/tables/document/queries";
import { getCurrentUserAction } from "../users";
import type { ReturnTuple } from "@/utils/type-utils";
import { getDocumentRelationsCountAction } from "../document-relations/read";
import { getDocumentByIdAction } from "./read";
import { redirect } from "next/navigation";
import fs from "fs";
import { revalidatePath } from "next/cache";
import { errorLogger } from "@/lib/exceptions";

const errorMessages = {
  mainTitle: "Document Delete Action Error:",
  unauthorized: "Unauthorized",
  withRelation: "You cannot delete a document that is linked to other entities",
  delete: "An error occurred while deleting the document",
};

const deleteDocumentErrorLog = errorLogger("Document Delete Action Error:");

export const deleteDocumentAction = async (
  id: number,
): Promise<ReturnTuple<number> | undefined> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [relationsCount, relationsCountError] =
    await getDocumentRelationsCountAction(id);
  if (relationsCountError !== null) return [null, relationsCountError];
  if (relationsCount !== 0) return [null, errorMessages.withRelation];

  const [document, documentError] = await getDocumentByIdAction(id);
  if (documentError !== null) return [null, documentError];

  const deleteResult = await deleteFileAction(document.path);
  if (!deleteResult) return [null, errorMessages.delete];

  const [, documentIdError] = await deleteDocument(id);
  if (documentIdError !== null) return [null, documentIdError];

  revalidatePath("/documents");
  redirect("/documents");
};

export const deleteFileAction = async (filePath: string): Promise<boolean> => {
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    deleteDocumentErrorLog(error);
    return false;
  }
};

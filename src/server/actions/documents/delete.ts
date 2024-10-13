"use server";

import { deleteDocument } from "@/server/db/tables/document/queries";
import { getCurrentUserAction } from "../users";
import type { ReturnTuple } from "@/utils/type-utils";
import { getDocumentRelationsCountAction } from "../document-relations/read";
import { getDocumentByIdAction } from "./read";
import { redirect } from "next/navigation";
import fs from "fs";
import { revalidatePath } from "next/cache";

export const deleteDocumentAction = async (
  id: number,
): Promise<ReturnTuple<number> | undefined> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [relationsCount, relationsCountError] =
    await getDocumentRelationsCountAction(id);
  if (relationsCountError !== null) return [null, relationsCountError];

  if (relationsCount !== 0)
    return [
      null,
      "You cannot delete a document that is linked to other documents",
    ];

  const [document, documentError] = await getDocumentByIdAction(id);
  if (documentError !== null) return [null, documentError];

  const deleteResult = await deleteFileAction(document.path);
  if (!deleteResult) return [null, "Error deleting document"];

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
    console.log(error);
    return false;
  }
};

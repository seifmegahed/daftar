"use server";

import { deleteDocumentRelation } from "@/server/db/tables/document-relation/queries";

import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";

export const unlinkDocumentAction = async (
  relationId: number,
  pathname?: string,
): Promise<ReturnTuple<number>> => {
  const [deleted, deleteError] = await deleteDocumentRelation(relationId);
  if (deleteError !== null) return [null, deleteError];
  if (pathname) revalidatePath(pathname);
  return [deleted, null];
};

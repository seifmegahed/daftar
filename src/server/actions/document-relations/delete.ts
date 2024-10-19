"use server";

import { revalidatePath } from "next/cache";

import { deleteDocumentRelation } from "@/server/db/tables/document-relation/mutations";

import type { ReturnTuple } from "@/utils/type-utils";

export const unlinkDocumentAction = async (
  relationId: number,
  pathname?: string,
): Promise<ReturnTuple<number>> => {
  const [deleted, deleteError] = await deleteDocumentRelation(relationId);
  if (deleteError !== null) return [null, deleteError];
  if (pathname) revalidatePath(pathname);
  return [deleted, null];
};

"use server";

import { deleteDocumentRelation } from "@/server/db/tables/document-relation/queries";

import type { ReturnTuple } from "@/utils/type-utils";

export const unlinkDocumentAction = async (
  relationId: number,
): Promise<ReturnTuple<number>> => {
  const [deleted, deleteError] = await deleteDocumentRelation(relationId);
  if (deleteError !== null) return [null, deleteError];
  return [deleted, null];
};

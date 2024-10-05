"use server";

import { insertDocumentRelation } from "@/server/db/tables/document-relation/queries";
import type { DocumentRelationsType } from "@/server/db/tables/document-relation/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const addDocumentRelationAction = async (
  relation: DocumentRelationsType,
): Promise<ReturnTuple<number>> => {
  const [result, resultError] = await insertDocumentRelation(relation);
  if (resultError !== null) return [null, resultError];
  return [result, null];
};

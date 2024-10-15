"use server";

import type { RelationDataType } from "@/components/common-forms/document-form";
import { errorLogger } from "@/lib/exceptions";
import { insertDocumentRelation } from "@/server/db/tables/document-relation/queries";
import {
  documentRelationsSchema,
  type DocumentRelationsType,
} from "@/server/db/tables/document-relation/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const documentRelationErrorLog = errorLogger("Document Relation Action Error:");

export const addDocumentRelationAction = async (
  relation: DocumentRelationsType,
  relationData: RelationDataType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = documentRelationsSchema.safeParse(relation);
  if (isValid.error) {
    documentRelationErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [, resultError] = await insertDocumentRelation(relation);
  if (resultError !== null) return [null, resultError];

  const { relationId: id, relationTo: type } = relationData;
  revalidatePath(`/${type}/${id}/documents`);
  redirect(`/${type}/${id}/documents`);
};

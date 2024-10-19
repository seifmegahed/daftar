"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { insertDocumentRelation } from "@/server/db/tables/document-relation/mutations";
import { documentRelationsSchema } from "@/server/db/tables/document-relation/schema";

import { errorLogger } from "@/lib/exceptions";

import type { DocumentRelationsType } from "@/server/db/tables/document-relation/schema";
import type { RelationDataType } from "@/components/common-forms/document-form";
import type { ReturnTuple } from "@/utils/type-utils";

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

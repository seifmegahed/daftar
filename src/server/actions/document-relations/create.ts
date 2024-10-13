"use server";

import type { RelationDataType } from "@/components/common-forms/document-form";
import { insertDocumentRelation } from "@/server/db/tables/document-relation/queries";
import type { DocumentRelationsType } from "@/server/db/tables/document-relation/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addDocumentRelationAction = async (
  relation: DocumentRelationsType,
  relationData: RelationDataType,
): Promise<ReturnTuple<number> | undefined> => {
  const [, resultError] = await insertDocumentRelation(relation);
  if (resultError !== null) return [null, resultError];
  const { relationId: id, relationTo: type } = relationData;
  switch (type) {
    case "project":
      revalidatePath(`/project/${id}/documents`);
      redirect(`/project/${id}/documents`);
    case "item":
      revalidatePath(`/item/${id}/documents`);
      redirect(`/item/${id}/documents`);
    case "supplier":
      revalidatePath(`/supplier/${id}/documents`);
      redirect(`/supplier/${id}/documents`);
    case "client":
      revalidatePath(`/client/${id}/documents`);
      redirect(`/client/${id}/documents`);
    default:
      return [null, "Invalid type"];
  }
};

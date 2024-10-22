"use server";

import { revalidatePath } from "next/cache";

import { deleteDocumentRelation } from "@/server/db/tables/document-relation/mutations";

import type { ReturnTuple } from "@/utils/type-utils";
import { revalidateProjectLinkedDocuments } from "@/server/cache/projects/revalidate";
import type { RelationDataType } from "@/components/common-forms/document-form";

export const unlinkDocumentAction = async (
  relationId: number,
  pathname?: string,
  relationData?: RelationDataType,
): Promise<ReturnTuple<number>> => {
  const [deleted, deleteError] = await deleteDocumentRelation(relationId);
  if (deleteError !== null) return [null, deleteError];
  if (relationData) {
    const { relationTo: type, relationId: id } = relationData;
    switch (type) {
      case "project":
        revalidateProjectLinkedDocuments(id);
    }
  }
  if (pathname) revalidatePath(pathname);
  return [deleted, null];
};

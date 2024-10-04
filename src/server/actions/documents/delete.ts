import { deleteDocument } from "@/server/db/tables/document/queries";
import { getCurrentUserAction } from "../users";
import type { ReturnTuple } from "@/utils/type-utils";
import { getDocumentRelationsCountAction } from "../document-relations/read";

export const deleteDocumentAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
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

  const [document, documentError] = await deleteDocument(id);
  if (documentError !== null) return [null, documentError];
  return [document, null];
};

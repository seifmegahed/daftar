import { deleteItem } from "@/server/db/tables/item/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserAction } from "../users";
import { getItemProjectsCountAction } from "../project-items/read";

export const deleteItemAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (currentUser?.role !== "admin") {
    return [null, "You do not have permission to delete this item"];
  }

  const [itemReferences, itemReferencesError] =
    await getItemProjectsCountAction(id);

  if (itemReferencesError !== null) return [null, itemReferencesError];

  if (itemReferences !== null && itemReferences > 0) {
    return [
      null,
      "You cannot delete an item that is referenced in other projects",
    ];
  }

  const [returnValue, error] = await deleteItem(id);
  if (error !== null) return [null, error];
  return [returnValue, null];
};

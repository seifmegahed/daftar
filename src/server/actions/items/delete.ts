"use server";

import { deleteItem } from "@/server/db/tables/item/queries";
import { getCurrentUserAction } from "../users";
import { getItemProjectsCountAction } from "../project-items/read";
import { redirect } from "next/navigation";

import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";

export const deleteItemAction = async (
  id: number,
): Promise<ReturnTuple<number> | undefined> => {
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

  const [, error] = await deleteItem(id);
  if (error !== null) return [null, error];
  revalidatePath("/items");
  redirect("/items");
};

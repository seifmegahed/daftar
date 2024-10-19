"use server";

import { revalidatePath } from "next/cache";

import { deletePurchaseItem } from "@/server/db/tables/purchase-item/mutations";

import type { ReturnTuple } from "@/utils/type-utils";

export const deletePurchaseItemAction = async (
  projectItemId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await deletePurchaseItem(projectItemId);
  if (error !== null) return [null, error];
  revalidatePath("project");
  return [returnValue, null];
};

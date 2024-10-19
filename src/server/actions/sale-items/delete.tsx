"use server";

import { revalidatePath } from "next/cache";

import { deleteSaleItem } from "@/server/db/tables/sale-item/mutations";
import { isCurrentUserAdminAction } from "@/server/actions/users";

export const deleteSaleItemAction = async (id: number) => {
  const [access] = await isCurrentUserAdminAction();
  if (!access) return [null, "Unauthorized"];
  const [result, error] = await deleteSaleItem(id);
  if (error !== null) return [null, error];
  revalidatePath("project");
  return [result, null];
};

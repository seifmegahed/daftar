"use server";

import { deleteCommercialOfferItem } from "@/server/db/tables/commercial-offer-item/queries";
import { isCurrentUserAdminAction } from "@/server/actions/users";
import { revalidatePath } from "next/cache";

export const deleteCommercialOfferItemAction = async (id: number) => {
  const [access] = await isCurrentUserAdminAction();
  if (!access) return [null, "Unauthorized"];
  const [result, error] = await deleteCommercialOfferItem(id);
  if (error !== null) return [null, error];
  revalidatePath("project");
  return [result, null];
};

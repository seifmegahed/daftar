"use server";

import { deleteCommercialOfferItem } from "@/server/db/tables/commercial-offer-item/queries";
import { isCurrentUserAdminAction } from "@/server/actions/users";

export const deleteCommercialOfferItemAction = async (id: number) => {
  const [access] = await isCurrentUserAdminAction();
  if (!access) return [null, "Access denied"];
  const [result, error] = await deleteCommercialOfferItem(id);
  if (error !== null) return [null, error];
  return [result, null];
};

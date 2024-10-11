import {
  getProjectCommercialOfferItems,
  getProjectCommercialOfferItemsCount,
} from "@/server/db/tables/commercial-offer-item/queries";
import { isCurrentUserAdminAction } from "../users";
import type { SelectCommercialOfferItemType } from "@/server/db/tables/commercial-offer-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const getProjectCommercialOfferItemsAction = async (
  projectId: number,
): Promise<ReturnTuple<SelectCommercialOfferItemType[]>> => {
  const [access] = await isCurrentUserAdminAction();
  if (!access) return [null, "Access denied"];
  const [items, itemsError] = await getProjectCommercialOfferItems(projectId);
  if (itemsError !== null) return [null, itemsError];
  return [items, null];
};

export const getProjectCommercialOfferItemsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [access] = await isCurrentUserAdminAction();
  if (!access) return [null, "Error: Access denied"];
  const [count, countError] =
    await getProjectCommercialOfferItemsCount(projectId);
  if (countError !== null) return [null, countError];
  return [count, null];
};

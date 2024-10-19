"use server";

import {
  getProjectSaleItems,
  getProjectSaleItemsCount,
} from "@/server/db/tables/sale-item/queries";
import { isCurrentUserAdminAction } from "../users";

import type { SaleItemType } from "@/server/db/tables/sale-item/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const getProjectSaleItemsAction = async (
  projectId: number,
): Promise<ReturnTuple<SaleItemType[]>> => {
  const [access] = await isCurrentUserAdminAction();
  if (!access) return [null, "Unauthorized"];
  const [items, itemsError] = await getProjectSaleItems(projectId);
  if (itemsError !== null) return [null, itemsError];
  return [items, null];
};

export const getProjectSaleItemsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [access] = await isCurrentUserAdminAction();
  if (!access) return [null, "Unauthorized"];
  const [count, countError] = await getProjectSaleItemsCount(projectId);
  if (countError !== null) return [null, countError];
  return [count, null];
};

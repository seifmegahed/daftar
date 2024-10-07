"use server";

import {
  getAllItemsBrief,
  getItemDetail,
  getItemsCount,
  listAllItems,
} from "@/server/db/tables/item/queries";

import type {
  BriefItemType,
  GetItemDetailType,
  ItemListType,
} from "@/server/db/tables/item/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const getItemsAction = async (
  page: number,
  searchText?: string,
  limit?: number,
): Promise<ReturnTuple<BriefItemType[]>> => {
  const [items, itemsError] = await getAllItemsBrief(page, searchText, limit);
  if (itemsError !== null) return [null, itemsError];
  return [items, null];
};

export const getItemDetailsAction = async (
  id: number,
): Promise<ReturnTuple<GetItemDetailType>> => {
  const [item, itemError] = await getItemDetail(id);
  if (itemError !== null) return [null, itemError];
  return [item, null];
};

export const listAllItemsAction = async (): Promise<
  ReturnTuple<ItemListType[]>
> => {
  const [items, itemsError] = await listAllItems();
  if (itemsError !== null) return [null, itemsError];
  return [items, null];
};

export const getItemsCountAction = async (): Promise<ReturnTuple<number>> => {
  const [items, itemsError] = await getItemsCount();
  if (itemsError !== null) return [null, itemsError];
  return [items, null];
};

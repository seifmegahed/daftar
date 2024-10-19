"use server";

import {
  getAllItemsBrief,
  getItemDetail,
  getItemProjects,
  getItemProjectsCount,
  getItemsCount,
  listAllItems,
} from "@/server/db/tables/item/queries";

import type {
  BriefItemType,
  GetItemDetailType,
  ItemListType,
  ItemProjectsType,
} from "@/server/db/tables/item/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import type { FilterArgs } from "@/components/filter-and-search";

export const getItemsAction = async (
  page: number,
  filter?: FilterArgs,
  searchText?: string,
  limit?: number,
): Promise<ReturnTuple<BriefItemType[]>> => {
  const [items, itemsError] = await getAllItemsBrief(
    page,
    filter,
    searchText,
    limit,
  );
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

export const getItemsCountAction = async (
  filter?: FilterArgs,
): Promise<ReturnTuple<number>> => {
  const [items, itemsError] = await getItemsCount(filter);
  if (itemsError !== null) return [null, itemsError];
  return [items, null];
};

export const getItemProjectsAction = async (
  itemId: number,
): Promise<ReturnTuple<ItemProjectsType[]>> => {
  const [projects, error] = await getItemProjects(itemId);
  if (error !== null) return [null, error];
  return [projects, null];
};

export const getItemProjectsCountAction = async (
  itemId: number,
): Promise<ReturnTuple<number>> => {
  const [count, error] = await getItemProjectsCount(itemId);
  if (error !== null) return [null, error];
  return [count, null];
};

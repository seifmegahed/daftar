"use server";

import { insertItemSchema } from "@/server/db/tables/item/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import type { z } from "zod";
import { getCurrentUserIdAction } from "../users";
import {
  type BriefItemType,
  type GetItemDetailType,
  type ItemListType,
  getAllItemsBrief,
  getItemDetail,
  getItemsCount,
  insertItem,
  listAllItems,
} from "@/server/db/tables/item/queries";

const addItemSchema = insertItemSchema.omit({
  createdBy: true,
});

type AddItemFormType = z.infer<typeof addItemSchema>;

export const addItemAction = async (
  itemData: AddItemFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = addItemSchema.safeParse(itemData);
  if (!isValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [itemId, itemInsertError] = await insertItem({
    name: itemData.name,
    type: itemData.type,
    description: itemData.description,
    mpn: itemData.mpn,
    make: itemData.make,
    notes: itemData.notes,
    createdBy: userId,
  });
  if (itemInsertError !== null) return [null, itemInsertError];

  return [itemId, null];
};

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

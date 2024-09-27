import type { ReturnTuple } from "@/utils/type-utils";
import { itemsTable, type AddItemType, type SelectItemType } from "./schema";
import { db } from "@/server/db";
import { getErrorMessage } from "@/lib/exceptions";
import { asc, desc } from "drizzle-orm";

export const insertItem = async (
  data: AddItemType,
): Promise<ReturnTuple<number>> => {
  try {
    const [item] = await db
      .insert(itemsTable)
      .values(data)
      .returning({ id: itemsTable.id });

    if (!item) throw new Error("Error inserting new item");
    return [item.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, `Item with name ${data.name} already exists`];
    return [null, getErrorMessage(error)];
  }
};

export type GetItemBriefType = Pick<
  SelectItemType,
  "id" | "name" | "type" | "make"
>;

export const getAllItemsBrief = async (): Promise<
  ReturnTuple<GetItemBriefType[]>
> => {
  try {
    const allItems = await db
      .select({
        id: itemsTable.id,
        name: itemsTable.name,
        type: itemsTable.type,
        make: itemsTable.make,
      })
      .from(itemsTable)
      .orderBy(desc(itemsTable.id));

    if (!allItems) return [null, "Error getting items"];

    return [allItems, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

type BriefUserType = {
  id: number;
  name: string;
};

export type GetItemDetailType = SelectItemType & {
  creator: BriefUserType;
  updater: BriefUserType | null;
};

export const getItemDetail = async (
  id: number,
): Promise<ReturnTuple<GetItemDetailType>> => {
  try {
    const item = await db.query.itemsTable.findFirst({
      where: (item, { eq }) => eq(item.id, id),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
          },
        },
        updater: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!item) return [null, "Error getting item"];
    return [item, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export type ItemListType = {
  id: number;
  name: string;
};

export const listAllItems = async (): Promise<ReturnTuple<ItemListType[]>> => {
  try {
    const items = await db
      .select({
        id: itemsTable.id,
        name: itemsTable.name,
      })
      .from(itemsTable)
      .orderBy(asc(itemsTable.name));

    if (!items) return [null, "Error getting items"];

    return [items, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting items"];
  }
};

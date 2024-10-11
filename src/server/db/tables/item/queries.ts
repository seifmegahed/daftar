import { db } from "@/server/db";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import { itemsTable } from "./schema";

import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";
import { defaultPageLimit } from "@/data/config";
import { getErrorMessage } from "@/lib/exceptions";
import { filterDefault } from "@/components/filter-and-search";

import type { AddItemType, SelectItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import type { FilterArgs } from "@/components/filter-and-search";

export const insertItem = async (
  data: AddItemType,
): Promise<ReturnTuple<number>> => {
  try {
    const [item] = await db
      .insert(itemsTable)
      .values(data)
      .returning();

    if (!item) throw new Error("Error inserting new item");
    return [item.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, `Item with name ${data.name} already exists`];
    return [null, getErrorMessage(error)];
  }
};

const itemFilterQuery = (filter: FilterArgs) => {
  switch (filter.filterType) {
    case "creationDate":
      return timestampQueryGenerator(itemsTable.createdAt, filter.filterValue);
    case "updateDate":
      return timestampQueryGenerator(itemsTable.updatedAt, filter.filterValue);
    default:
      return sql`true`;
  }
};

const itemSearchQuery = (searchText: string) =>
  sql`
    (
      setweight(to_tsvector('english', ${itemsTable.name}), 'A') ||
      setweight(to_tsvector('english', coalesce(${itemsTable.type}, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(${itemsTable.make}, '')), 'C')
    ), to_tsquery(${prepareSearchText(searchText)})
  `;

export type BriefItemType = Pick<
  SelectItemType,
  "id" | "name" | "type" | "make" | "createdAt"
>;

export const getAllItemsBrief = async (
  page: number,
  filter: FilterArgs = filterDefault,
  searchText?: string,
  limit = defaultPageLimit,
): Promise<ReturnTuple<BriefItemType[]>> => {
  try {
    const allItems = await db
      .select({
        id: itemsTable.id,
        name: itemsTable.name,
        type: itemsTable.type,
        make: itemsTable.make,
        createdAt: itemsTable.createdAt,
        rank: searchText
          ? sql`ts_rank(${itemSearchQuery(searchText)})`
          : sql`1`,
      })
      .from(itemsTable)
      .where(itemFilterQuery(filter))
      .orderBy((table) => (searchText ? desc(table.rank) : desc(table.id)))
      .limit(limit)
      .offset((page - 1) * limit);

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

export const getItemsCount = async (
  filter: FilterArgs = filterDefault,
): Promise<ReturnTuple<number>> => {
  try {
    const [items] = await db
      .select({ count: count() })
      .from(itemsTable)
      .where(itemFilterQuery(filter))
      .limit(1);

    if (!items) return [null, "Error getting items count"];
    return [items.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateItem = async (
  id: number,
  data: Partial<SelectItemType>,
): Promise<ReturnTuple<number>> => {
  try {
    const [item] = await db
      .update(itemsTable)
      .set(data)
      .where(eq(itemsTable.id, id))
      .returning();

    if (!item) return [null, "Error updating item"];
    return [item.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const deleteItem = async (id: number): Promise<ReturnTuple<number>> => {
  try {
    const [item] = await db
      .delete(itemsTable)
      .where(eq(itemsTable.id, id))
      .returning();

    if (!item) return [null, "Error deleting item"];
    return [item.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

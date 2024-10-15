import { db } from "@/server/db";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import { itemsTable } from "./schema";

import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";
import { defaultPageLimit } from "@/data/config";
import { checkUniqueConstraintError, errorLogger } from "@/lib/exceptions";
import { filterDefault } from "@/components/filter-and-search";

import type { AddItemType, SelectItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import type { FilterArgs } from "@/components/filter-and-search";

const errorMessages = {
  mainTitle: "Item Queries Error:",
  insert: "An error occurred while adding item",
  update: "An error occurred while updating item",
  delete: "An error occurred while deleting item",
  getItem: "An error occurred while getting item",
  getItems: "An error occurred while getting items",
  count: "An error occurred while counting items",
  nameExits: "Item name already exists",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertItem = async (
  data: AddItemType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [item] = await db.insert(itemsTable).values(data).returning();
    if (!item) return [null, errorMessage];

    return [item.id, null];
  } catch (error) {
    logError(error);
    return [
      null,
      checkUniqueConstraintError(error)
        ? errorMessages.nameExits
        : errorMessage,
    ];
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
  const errorMessage = errorMessages.getItems;
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

    if (!allItems) return [null, errorMessage];

    return [allItems, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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
  const errorMessage = errorMessages.getItem;
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
    if (!item) return [null, errorMessage];

    return [item, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export type ItemListType = {
  id: number;
  name: string;
};

export const listAllItems = async (): Promise<ReturnTuple<ItemListType[]>> => {
  const errorMessage = errorMessages.getItems;
  try {
    const items = await db
      .select({
        id: itemsTable.id,
        name: itemsTable.name,
      })
      .from(itemsTable)
      .orderBy(asc(itemsTable.name));

    if (!items) return [null, errorMessage];

    return [items, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getItemsCount = async (
  filter: FilterArgs = filterDefault,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [items] = await db
      .select({ count: count() })
      .from(itemsTable)
      .where(itemFilterQuery(filter))
      .limit(1);

    if (!items) return [null, errorMessage];
    return [items.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const updateItem = async (
  id: number,
  data: Partial<SelectItemType>,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [item] = await db
      .update(itemsTable)
      .set(data)
      .where(eq(itemsTable.id, id))
      .returning();

    if (!item) return [null, errorMessage];

    return [item.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteItem = async (id: number): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [item] = await db
      .delete(itemsTable)
      .where(eq(itemsTable.id, id))
      .returning();

    if (!item) return [null, errorMessage];

    return [item.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

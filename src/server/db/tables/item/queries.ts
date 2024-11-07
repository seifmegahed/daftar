import { z } from "zod";
import { db } from "@/server/db";
import { asc, count, desc, sql, eq, inArray } from "drizzle-orm";
import {
  clientsTable,
  itemsTable,
  projectsTable,
  purchaseItemsTable,
  saleItemsTable,
} from "@/server/db/schema";

import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";

import { defaultPageLimit } from "@/data/config";
import { filterDefault } from "@/components/filter-and-search";
import { errorLogger } from "@/lib/exceptions";

import type { SelectItemType } from "./schema";
import type { FilterArgs } from "@/components/filter-and-search";
import type { ReturnTuple } from "@/utils/type-utils";
import { performanceTimer } from "@/utils/performance";

const errorMessages = {
  mainTitle: "Item Queries Error:",
  getItem: "An error occurred while getting item",
  getItems: "An error occurred while getting items",
  getProjects: "An error occurred while getting projects",
  count: "An error occurred while counting items",
  dataCorrupted: "It seems that some data is corrupted",
};

const logError = errorLogger(errorMessages.mainTitle);

const itemFilterQuery = (filter: FilterArgs) => {
  switch (filter.filterType) {
    case "createdBy":
      return sql`${itemsTable.createdBy} = ${filter.filterValue}`;
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
  const timer = new performanceTimer("getAllItemsBrief");
  try {
    timer.start();
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
    timer.end();

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
  const timer = new performanceTimer("getItemDetail");
  try {
    timer.start();
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
    timer.end();

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
  const timer = new performanceTimer("listAllItems");
  try {
    timer.start();
    const items = await db
      .select({
        id: itemsTable.id,
        name: itemsTable.name,
      })
      .from(itemsTable)
      .orderBy(asc(itemsTable.name));
    timer.end();

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
  const timer = new performanceTimer("getItemsCount");
  try {
    timer.start();
    const [items] = await db
      .select({ count: count() })
      .from(itemsTable)
      .where(itemFilterQuery(filter))
      .limit(1);
    timer.end();

    if (!items) return [null, errorMessage];
    return [items.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const itemProjectsSchema = z.object({
  id: z.number(),
  name: z.string(),
  clientId: z.number(),
  clientName: z.string(),
  status: z.number(),
  createdAt: z.date(),
});

export type ItemProjectsType = z.infer<typeof itemProjectsSchema>;

export const getItemProjects = async (
  itemId: number,
): Promise<ReturnTuple<ItemProjectsType[]>> => {
  const errorMessage = errorMessages.getProjects;
  const timer = new performanceTimer("getItemProjects");
  try {
    timer.start();
    const projects = await db.transaction(async (tx) => {
      const purchaseItems = await tx
        .select({
          id: purchaseItemsTable.id,
          projectId: purchaseItemsTable.projectId,
        })
        .from(purchaseItemsTable)
        .where(eq(purchaseItemsTable.itemId, itemId));

      const saleItems = await tx
        .select({
          id: saleItemsTable.id,
          projectId: saleItemsTable.projectId,
        })
        .from(saleItemsTable)
        .where(eq(saleItemsTable.itemId, itemId));

      const projectIds = new Map<number, number>();

      purchaseItems.forEach((item) => {
        if (!projectIds.has(item.projectId)) {
          projectIds.set(item.projectId, item.projectId);
        }
      });

      saleItems.forEach((item) => {
        if (!projectIds.has(item.projectId)) {
          projectIds.set(item.projectId, item.projectId);
        }
      });

      const projectIdsArray = Array.from(projectIds.values());

      const projects = await tx
        .select({
          id: projectsTable.id,
          name: projectsTable.name,
          clientId: projectsTable.clientId,
          clientName: clientsTable.name,
          status: projectsTable.status,
          createdAt: projectsTable.createdAt,
        })
        .from(projectsTable)
        .where(inArray(projectsTable.id, projectIdsArray))
        .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
        .orderBy(desc(projectsTable.id));

      return projects;
    });
    timer.end();

    if (!projects) return [null, errorMessage];

    const parsedProjects = z.array(itemProjectsSchema).safeParse(projects);
    if (parsedProjects.error) return [null, errorMessages.dataCorrupted];

    return [parsedProjects.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getItemProjectsCount = async (
  itemId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  const timer = new performanceTimer("getItemProjectsCount");
  try {
    timer.start();
    const count = await db.transaction(async (tx) => {
      const purchaseItems = await tx
        .select({ projectId: purchaseItemsTable.projectId })
        .from(purchaseItemsTable)
        .where(eq(purchaseItemsTable.itemId, itemId));

      const saleItems = await tx
        .select({ projectId: saleItemsTable.projectId })
        .from(saleItemsTable)
        .where(eq(saleItemsTable.itemId, itemId));

      const projectIds = new Map<number, number>();

      purchaseItems.forEach((item) => {
        if (!projectIds.has(item.projectId)) {
          projectIds.set(item.projectId, item.projectId);
        }
      });

      saleItems.forEach((item) => {
        if (!projectIds.has(item.projectId)) {
          projectIds.set(item.projectId, item.projectId);
        }
      });

      return projectIds.size;
    });
    timer.end();

    if (!count) return [null, errorMessage];
    return [count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

import { db } from "@/server/db";
import { commercialOfferItemsTable } from "./schema";
import type { InsertCommercialOfferItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { count, eq } from "drizzle-orm";
import { itemsTable } from "../item/schema";
import { z } from "zod";
import { errorLogger } from "@/lib/exceptions";

const errorMessages = {
  mainTitle: "Commercial Offer Queries Error:",
  insert: "An error occurred while adding sale item",
  corruptedData: "It seems that some data is corrupted",
  getItems: "An error occurred while getting items",
  count: "An error occurred while counting items",
  delete: "An error occurred while deleting sale item",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertCommercialOfferItem = async (
  data: InsertCommercialOfferItemType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [result] = await db
      .insert(commercialOfferItemsTable)
      .values(data)
      .returning();

    if (!result) return [null, errorMessage];
    return [result.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const saleItemSchema = z.object({
  id: z.number(),
  itemId: z.number(),
  name: z.string(),
  make: z.string().nullable(),
  price: z.string(),
  currency: z.number(),
  quantity: z.number(),
});

export type SaleItemType = z.infer<typeof saleItemSchema>;

export const getProjectCommercialOfferItems = async (
  projectId: number,
): Promise<ReturnTuple<SaleItemType[]>> => {
  const errorMessage = errorMessages.getItems;
  try {
    const data = await db
      .select({
        id: commercialOfferItemsTable.id,
        itemId: commercialOfferItemsTable.itemId,
        name: itemsTable.name,
        make: itemsTable.make,
        price: commercialOfferItemsTable.price,
        currency: commercialOfferItemsTable.currency,
        quantity: commercialOfferItemsTable.quantity,
      })
      .from(commercialOfferItemsTable)
      .leftJoin(itemsTable, eq(commercialOfferItemsTable.itemId, itemsTable.id))
      .where(eq(commercialOfferItemsTable.projectId, projectId))
      .orderBy(commercialOfferItemsTable.id);

    if (!data) return [null, errorMessages.corruptedData];
    const parseResult = z.array(saleItemSchema).safeParse(data);
    if (parseResult.error !== undefined) {
      console.log(parseResult.error);
      return [null, errorMessage];
    }
    return [parseResult.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getProjectCommercialOfferItemsCount = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [result] = await db
      .select({ count: count() })
      .from(commercialOfferItemsTable)
      .where(eq(commercialOfferItemsTable.projectId, projectId))
      .limit(1);

    if (!result) return [null, errorMessage];
    return [result.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteCommercialOfferItem = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [result] = await db
      .delete(commercialOfferItemsTable)
      .where(eq(commercialOfferItemsTable.id, id))
      .returning();

    if (!result) return [null, errorMessage];
    return [result.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

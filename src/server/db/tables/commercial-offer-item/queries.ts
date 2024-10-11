import { db } from "@/server/db";
import { commercialOfferItemsTable } from "./schema";
import type { InsertCommercialOfferItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { count, eq } from "drizzle-orm";
import { itemsTable } from "../item/schema";
import { z } from "zod";

export const insertCommercialOfferItem = async (
  data: InsertCommercialOfferItemType,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .insert(commercialOfferItemsTable)
      .values(data)
      .returning({ id: commercialOfferItemsTable.id });

    if (!result) return [null, "Error: Cannot insert commercial offer item"];
    return [result.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error: Cannot insert commercial offer item"];
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

    if (!data) return [null, "Error: Cannot get commercial offer items"];
    const parseResult = z.array(saleItemSchema).safeParse(data);
    if (parseResult.error !== undefined) {
      console.log(parseResult.error);
      return [null, "Error: Cannot get commercial offer items"];
    }
    return [parseResult.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error: Cannot get commercial offer items"];
  }
};

export const getProjectCommercialOfferItemsCount = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .select({ count: count() })
      .from(commercialOfferItemsTable)
      .where(eq(commercialOfferItemsTable.projectId, projectId))
      .limit(1);
    if (!result) return [null, "Error: Cannot get commercial offer item count"];
    return [result.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error: Cannot get commercial offer item count"];
  }
};

export const deleteCommercialOfferItem = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .delete(commercialOfferItemsTable)
      .where(eq(commercialOfferItemsTable.id, id))
      .returning({ id: commercialOfferItemsTable.id });

    if (!result) return [null, "Error: Cannot delete commercial offer item"];
    return [result.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error: Cannot delete commercial offer item"];
  }
};

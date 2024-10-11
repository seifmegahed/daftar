import { db } from "@/server/db";
import { commercialOfferItemsTable } from "./schema";
import type {
  InsertCommercialOfferItemType,
  SelectCommercialOfferItemType,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { count, eq } from "drizzle-orm";

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

export const getProjectCommercialOfferItems = async (
  projectId: number,
): Promise<ReturnTuple<SelectCommercialOfferItemType[]>> => {
  try {
    const result = await db
      .select()
      .from(commercialOfferItemsTable)
      .where(eq(commercialOfferItemsTable.projectId, projectId))
      .orderBy(commercialOfferItemsTable.id);

    if (!result) return [null, "Error: Cannot get commercial offer items"];
    return [result, null];
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

import { db } from "@/server/db";
import { eq } from "drizzle-orm";

import { commercialOfferItemsTable } from "./schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertCommercialOfferItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Commercial Offer Mutations Error:",
  insert: "An error occurred while adding sale item",
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

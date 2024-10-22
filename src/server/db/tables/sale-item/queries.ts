import { z } from "zod";
import { db } from "@/server/db";
import { count, eq } from "drizzle-orm";
import { saleItemsTable, itemsTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { ReturnTuple } from "@/utils/type-utils";
import { performanceTimer } from "@/utils/performance";

const errorMessages = {
  mainTitle: "Sale Item Queries Error:",
  corruptedData: "It seems that some data is corrupted",
  getItems: "An error occurred while getting items",
  count: "An error occurred while counting items",
};

const logError = errorLogger(errorMessages.mainTitle);

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

export const getProjectSaleItems = async (
  projectId: number,
): Promise<ReturnTuple<SaleItemType[]>> => {
  const errorMessage = errorMessages.getItems;
  const timer = new performanceTimer("getProjectSaleItems");
  try {
    timer.start();
    const data = await db
      .select({
        id: saleItemsTable.id,
        itemId: saleItemsTable.itemId,
        name: itemsTable.name,
        make: itemsTable.make,
        price: saleItemsTable.price,
        currency: saleItemsTable.currency,
        quantity: saleItemsTable.quantity,
      })
      .from(saleItemsTable)
      .leftJoin(itemsTable, eq(saleItemsTable.itemId, itemsTable.id))
      .where(eq(saleItemsTable.projectId, projectId))
      .orderBy(saleItemsTable.id);
    timer.end();

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

export const getProjectSaleItemsCount = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  const timer = new performanceTimer("getProjectSaleItemsCount");
  try {
    timer.start();
    const [result] = await db
      .select({ count: count() })
      .from(saleItemsTable)
      .where(eq(saleItemsTable.projectId, projectId))
      .limit(1);
    timer.end();

    if (!result) return [null, errorMessage];
    return [result.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

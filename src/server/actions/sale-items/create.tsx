"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { insertSaleItem } from "@/server/db/tables/sale-item/mutations";
import { insertSaleItemSchema } from "@/server/db/tables/sale-item/schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertSaleItemType } from "@/server/db/tables/sale-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";

const saleItemErrorLog = errorLogger(
  "Sale Item Action Error:",
);

export const createSaleItemAction = async (
  data: InsertSaleItemType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = insertSaleItemSchema.safeParse(data);
  if (isValid.error) {
    saleItemErrorLog(isValid.error);
    return [null, "Invalid data"];
  }
  const [, error] = await insertSaleItem(data);
  if (error !== null) return [null, error];
  
  revalidatePath("project");
  redirect(`/project/${data.projectId}/sale-items`);
};

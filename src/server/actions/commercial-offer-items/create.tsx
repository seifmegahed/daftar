"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { insertCommercialOfferItem } from "@/server/db/tables/commercial-offer-item/mutations";
import { insertCommercialOfferItemSchema } from "@/server/db/tables/commercial-offer-item/schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertCommercialOfferItemType } from "@/server/db/tables/commercial-offer-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";

const commercialOfferItemErrorLog = errorLogger(
  "Commercial Offer Item Action Error:",
);

export const createCommercialOfferItemAction = async (
  data: InsertCommercialOfferItemType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = insertCommercialOfferItemSchema.safeParse(data);
  if (isValid.error) {
    commercialOfferItemErrorLog(isValid.error);
    return [null, "Invalid data"];
  }
  const [, error] = await insertCommercialOfferItem(data);
  if (error !== null) return [null, error];
  revalidatePath("project");
  redirect(`/project/${data.projectId}/sale-items`);
};

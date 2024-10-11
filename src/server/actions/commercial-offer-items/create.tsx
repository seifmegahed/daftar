import { insertCommercialOfferItem } from "@/server/db/tables/commercial-offer-item/queries";
import { insertCommercialOfferItemSchema } from "@/server/db/tables/commercial-offer-item/schema";
import type { InsertCommercialOfferItemType } from "@/server/db/tables/commercial-offer-item/schema";

export const createCommercialOfferItemAction = async (
  data: InsertCommercialOfferItemType,
) => {
  const isValid = insertCommercialOfferItemSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];
  const [result, error] = await insertCommercialOfferItem(data);
  if (error !== null) return [null, error];
  return [result, null];
};

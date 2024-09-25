import { insertNewAddress } from "@/server/db/tables/address/queries";
import {
  insertAddressSchema,
  type InsertAddressType,
} from "@/server/db/tables/address/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const insertNewAddressAction = async (
  data: InsertAddressType,
): Promise<ReturnTuple<number>> => {
  const isValid = insertAddressSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [addressId, addressInsertError] = await insertNewAddress(data);
  if (addressInsertError !== null) return [null, addressInsertError];

  return [addressId, null];
};

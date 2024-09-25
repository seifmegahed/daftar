"use server";

import { insertNewAddress } from "@/server/db/tables/address/queries";
import {
  insertAddressSchema,
  type InsertAddressType,
} from "@/server/db/tables/address/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "../users";

export const addNewAddressAction = async (
  data: InsertAddressType,
): Promise<ReturnTuple<number>> => {
  const isValid = insertAddressSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [addressId, addressInsertError] = await insertNewAddress({
    ...data,
    createdBy: currentUserId,
  });
  if (addressInsertError !== null) return [null, addressInsertError];

  return [addressId, null];
};

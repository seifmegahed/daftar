import type { ReturnTuple } from "@/utils/type-utils";
import { addressesTable, type InsertAddressType } from "./schema";
import { db } from "@/server/db";
import { getErrorMessage } from "@/lib/exceptions";

export const insertNewAddress = async (
  data: InsertAddressType,
): Promise<ReturnTuple<number>> => {
  try {
    const [address] = await db
      .insert(addressesTable)
      .values(data)
      .returning({ id: addressesTable.id });

    if (!address) return [null, "Error inserting new address"];
    return [address.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { addressesTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { InsertAddressType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Address Mutations Error:",
  insert: "An error occurred while adding address",
  delete: "An error occurred while deleting address",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertNewAddress = async (
  data: InsertAddressType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [address] = await db.insert(addressesTable).values(data).returning();
    if (!address) return [null, errorMessage];
    return [address.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteAddress = async (
  addressId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [address] = await db
      .delete(addressesTable)
      .where(eq(addressesTable.id, addressId))
      .returning();

    if (!address) return [null, errorMessage];
    return [address.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

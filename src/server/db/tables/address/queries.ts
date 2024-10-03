import type { ReturnTuple } from "@/utils/type-utils";
import {
  addressesTable,
  type SelectAddressType,
  type InsertAddressType,
} from "./schema";
import { db } from "@/server/db";
import { getErrorMessage } from "@/lib/exceptions";
import { count, eq } from "drizzle-orm";

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

export const getClientAddressesCount = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [addresses] = await db
      .select({ count: count() })
      .from(addressesTable)
      .where(eq(addressesTable.clientId, clientId))
      .limit(1);

    if (!addresses) return [null, "Error getting client addresses count"];
    return [addresses.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getClientAddresses = async (
  clientId: number,
): Promise<ReturnTuple<SelectAddressType[]>> => {
  try {
    const addresses = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.clientId, clientId))
      .orderBy(addressesTable.id);

    if (!addresses) return [null, "Error getting client addresses"];
    return [addresses, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getSupplierAddressesCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [addresses] = await db
      .select({ count: count() })
      .from(addressesTable)
      .where(eq(addressesTable.supplierId, supplierId))
      .limit(1);

    if (!addresses) return [null, "Error getting supplier addresses count"];
    return [addresses.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getSupplierAddresses = async (
  supplierId: number,
): Promise<ReturnTuple<SelectAddressType[]>> => {
  try {
    const addresses = await db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.supplierId, supplierId))
      .orderBy(addressesTable.id);

    if (!addresses) return [null, "Error getting supplier addresses"];
    return [addresses, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const deleteAddress = async (
  addressId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [address] = await db
      .delete(addressesTable)
      .where(eq(addressesTable.id, addressId))
      .returning({ id: addressesTable.id });

    if (!address) return [null, "Error deleting address"];
    return [address.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

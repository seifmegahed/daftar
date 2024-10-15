import type { ReturnTuple } from "@/utils/type-utils";
import { addressesTable, type InsertAddressType } from "./schema";
import { db } from "@/server/db";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { usersTable } from "../user/schema";
import { errorLogger } from "@/lib/exceptions";

const errorMessages = {
  mainTitle: "Address Queries Error:",
  dataCorrupted: "Error: Addresses data corrupted",
  insert: "An error occurred while inserting new address",
  get: "An error occurred while getting addresses",
  getCount: "An error occurred while counting addresses",
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

export const getClientAddressesCount = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.getCount;
  try {
    const [addresses] = await db
      .select({ count: count() })
      .from(addressesTable)
      .where(eq(addressesTable.clientId, clientId))
      .limit(1);

    if (!addresses) return [null, errorMessage];
    return [addresses.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const getAddressSchema = z.object({
  id: z.number(),
  name: z.string(),
  addressLine: z.string(),
  country: z.string(),
  city: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdBy: z.string(),
  updatedBy: z.string().nullable(),
});

export type AddressType = z.infer<typeof getAddressSchema>;

export const getClientAddresses = async (
  clientId: number,
): Promise<ReturnTuple<AddressType[]>> => {
  const errorMessage = errorMessages.get;
  try {
    const addresses = await db
      .select({
        id: addressesTable.id,
        name: addressesTable.name,
        addressLine: addressesTable.addressLine,
        country: addressesTable.country,
        city: addressesTable.city,
        notes: addressesTable.notes,
        createdAt: addressesTable.createdAt,
        updatedAt: addressesTable.updatedAt,
        createdBy: usersTable.name,
        updatedBy: usersTable.name,
      })
      .from(addressesTable)
      .leftJoin(usersTable, eq(addressesTable.createdBy, usersTable.id))
      .where(eq(addressesTable.clientId, clientId))
      .orderBy(addressesTable.id);

    if (!addresses) return [null, errorMessage];
    const parsedAddresses = z.array(getAddressSchema).safeParse(addresses);

    if (!parsedAddresses.success) return [null, errorMessages.dataCorrupted];
    return [parsedAddresses.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierAddressesCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.getCount;
  try {
    const [addresses] = await db
      .select({ count: count() })
      .from(addressesTable)
      .where(eq(addressesTable.supplierId, supplierId))
      .limit(1);

    if (!addresses) return [null, errorMessage];
    return [addresses.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierAddresses = async (
  supplierId: number,
): Promise<ReturnTuple<AddressType[]>> => {
  const errorMessage = errorMessages.get;
  try {
    const addresses = await db
      .select({
        id: addressesTable.id,
        name: addressesTable.name,
        addressLine: addressesTable.addressLine,
        country: addressesTable.country,
        city: addressesTable.city,
        notes: addressesTable.notes,
        createdAt: addressesTable.createdAt,
        updatedAt: addressesTable.updatedAt,
        createdBy: usersTable.name,
        updatedBy: usersTable.name,
      })
      .from(addressesTable)
      .leftJoin(usersTable, eq(addressesTable.createdBy, usersTable.id))
      .where(eq(addressesTable.supplierId, supplierId))
      .orderBy(addressesTable.id);

    if (!addresses) return [null, errorMessage];
    const parsedAddresses = z.array(getAddressSchema).safeParse(addresses);

    if (!parsedAddresses.success) return [null, errorMessages.dataCorrupted];

    return [parsedAddresses.data, null];
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

import type { ReturnTuple } from "@/utils/type-utils";
import { addressesTable, type InsertAddressType } from "./schema";
import { db } from "@/server/db";
import { getErrorMessage } from "@/lib/exceptions";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { usersTable } from "../user/schema";

export const insertNewAddress = async (
  data: InsertAddressType,
): Promise<ReturnTuple<number>> => {
  try {
    const [address] = await db.insert(addressesTable).values(data).returning();

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

    if (!addresses) return [null, "Error getting client addresses"];
    const parsedAddresses = z.array(getAddressSchema).safeParse(addresses);

    if (!parsedAddresses.success) return [null, "Error parsing addresses"];
    return [parsedAddresses.data, null];
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
): Promise<ReturnTuple<AddressType[]>> => {
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

    if (!addresses) return [null, "Error getting supplier addresses"];
    const parsedAddresses = z.array(getAddressSchema).safeParse(addresses);

    if (!parsedAddresses.success) return [null, "Error parsing addresses"];

    return [parsedAddresses.data, null];
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
      .returning();

    if (!address) return [null, "Error deleting address"];
    return [address.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

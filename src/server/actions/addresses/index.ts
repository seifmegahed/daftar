"use server";

import {
  type AddressType,
  getClientAddresses,
  getClientAddressesCount,
  getSupplierAddresses,
  getSupplierAddressesCount,
} from "@/server/db/tables/address/queries";
import {
  insertNewAddress,
  deleteAddress,
} from "@/server/db/tables/address/mutations";
import {
  insertAddressSchemaRaw,
  insertAddressSchemaRefineCallback,
} from "@/server/db/tables/address/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "@/server/actions/users";
import type { z } from "zod";
import { redirect } from "next/navigation";
import { errorLogger } from "@/lib/exceptions";
import { revalidatePath } from "next/cache";

const addressErrorLog = errorLogger("Address Action Error:");

const addAddressSchema = insertAddressSchemaRaw
  .omit({
    createdBy: true,
    updatedBy: true,
  })
  .refine(insertAddressSchemaRefineCallback);

type AddAddressType = z.infer<typeof addAddressSchema>;

export const addNewAddressAction = async (
  data: AddAddressType,
  type: "client" | "supplier",
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = addAddressSchema.safeParse(data);
  if (isValid.error) {
    addressErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [, addressInsertError] = await insertNewAddress({
    name: isValid.data.name,
    addressLine: isValid.data.addressLine,
    country: isValid.data.country,
    city: isValid.data.city,
    notes: isValid.data.notes,
    createdBy: currentUserId,
    supplierId: isValid.data.clientId ? null : isValid.data.supplierId,
    clientId: isValid.data.supplierId ? null : isValid.data.clientId,
  });
  if (addressInsertError !== null) return [null, addressInsertError];
  const basePath =
    type === "client"
      ? `/client/${isValid.data.clientId}`
      : `/supplier/${isValid.data.supplierId}`;
  revalidatePath(basePath);
  redirect(basePath + "/addresses/");
};

export const getClientAddressesCountAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [addressesCount, error] = await getClientAddressesCount(clientId);
  if (error !== null) return [null, error];
  return [addressesCount, null];
};

export const getClientAddressesAction = async (
  clientId: number,
): Promise<ReturnTuple<AddressType[]>> => {
  const [addresses, error] = await getClientAddresses(clientId);
  if (error !== null) return [null, error];
  return [addresses, null];
};

export const getSupplierAddressesCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [addressesCount, error] = await getSupplierAddressesCount(supplierId);
  if (error !== null) return [null, error];
  return [addressesCount, null];
};

export const getSupplierAddressesAction = async (
  supplierId: number,
): Promise<ReturnTuple<AddressType[]>> => {
  const [addresses, error] = await getSupplierAddresses(supplierId);
  if (error !== null) return [null, error];
  return [addresses, null];
};

export const deleteAddressAction = async (
  addressId: number,
  pathname?: string,
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await deleteAddress(addressId);
  if (error !== null) return [null, error];
  if (pathname) revalidatePath(pathname);
  return [returnValue, null];
};

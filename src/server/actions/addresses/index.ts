"use server";

import {
  type AddressType,
  deleteAddress,
  getClientAddresses,
  getClientAddressesCount,
  getSupplierAddresses,
  getSupplierAddressesCount,
  insertNewAddress,
} from "@/server/db/tables/address/queries";
import {
  insertAddressSchemaRaw,
  insertAddressSchemaRefineCallback,
} from "@/server/db/tables/address/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "@/server/actions/users";
import type { z } from "zod";
import { redirect } from "next/navigation";

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
  if (!isValid.success) return [null, "Invalid data"];

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
  redirect(`/${type}`);
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
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await deleteAddress(addressId);
  if (error !== null) return [null, error];
  return [returnValue, null];
};

"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "../users";
import { insertSupplierSchema } from "@/server/db/tables/supplier/schema";
import {
  type BriefSupplierType,
  type GetSupplierType,
  type SupplierListType,
  getSuppliersBrief,
  getSupplierFullById,
  getSuppliersCount,
  insertNewSupplier,
  listAllSuppliers,
  updateSupplier,
  getSupplierPrimaryAddressId,
  getSupplierPrimaryContactId,
} from "@/server/db/tables/supplier/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { insertContactSchemaRaw } from "@/server/db/tables/contact/schema";
import { insertAddressSchemaRaw } from "@/server/db/tables/address/schema";

export const getSupplierPrimaryAddressIdAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [addressId, error] = await getSupplierPrimaryAddressId(supplierId);
  if (error !== null) return [null, error];
  return [addressId, null];
};

export const getSupplierPrimaryContactIdAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [contactId, error] = await getSupplierPrimaryContactId(supplierId);
  if (error !== null) return [null, error];
  return [contactId, null];
};

export const updateSupplierPrimaryAddressAction = async (
  supplierId: number,
  addressId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await updateSupplier(supplierId, {
    primaryAddressId: addressId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

export const getSuppliersBriefAction = async (
  page: number,
  searchText?: string,
  limit?: number,
): Promise<ReturnTuple<BriefSupplierType[]>> => {
  const [suppliers, suppliersError] = await getSuppliersBrief(
    page,
    searchText,
    limit,
  );
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
};

const addSupplierSchema = insertSupplierSchema.omit({
  createdBy: true,
});

export type AddSupplierFormType = z.infer<typeof addSupplierSchema>;

const addClientAddressSchema = insertAddressSchemaRaw.omit({
  clientId: true,
  supplierId: true,
  createdBy: true,
  createdAt: true,
});

type AddSupplierAddressType = z.infer<typeof addClientAddressSchema>;

const addClientContactSchema = insertContactSchemaRaw.omit({
  clientId: true,
  supplierId: true,
  createdBy: true,
  createdAt: true,
});

type AddSupplierContactType = z.infer<typeof addClientContactSchema>;

export const addSupplierAction = async (
  clientData: AddSupplierFormType,
  addressData: AddSupplierAddressType,
  contactData: AddSupplierContactType,
): Promise<ReturnTuple<number>> => {
  const isSupplierValid = addSupplierSchema.safeParse(clientData);
  if (!isSupplierValid.success) return [null, "Invalid data"];

  const isAddressValid = addClientAddressSchema.safeParse(addressData);
  if (!isAddressValid.success) return [null, "Invalid data"];

  const isContactValid = addClientContactSchema.safeParse(contactData);
  if (!isContactValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [supplierId, supplierInsertError] = await insertNewSupplier(
    {
      name: clientData.name,
      field: clientData.field,
      registrationNumber: clientData.registrationNumber,
      website: clientData.website,
      notes: clientData.notes,
      createdBy: userId,
    },
    {
      name: addressData.name,
      addressLine: addressData.addressLine,
      country: addressData.country,
      city: addressData.city,
      notes: addressData.notes,
      createdBy: userId,
    },
    {
      name: contactData.name,
      phoneNumber: contactData.phoneNumber,
      email: contactData.email,
      notes: contactData.notes,
      createdBy: userId,
    },
  );
  if (supplierInsertError !== null) return [null, supplierInsertError];

  return [supplierId, null];
};

export const getSupplierFullByIdAction = async (
  id: number,
): Promise<ReturnTuple<GetSupplierType>> => {
  const [supplier, supplierError] = await getSupplierFullById(id);
  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

export const listAllSuppliersAction = async (): Promise<
  ReturnTuple<SupplierListType[]>
> => {
  const [suppliers, suppliersError] = await listAllSuppliers();
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
};

export const getSuppliersCountAction = async (): Promise<
  ReturnTuple<number>
> => {
  const [suppliers, suppliersError] = await getSuppliersCount();
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
};

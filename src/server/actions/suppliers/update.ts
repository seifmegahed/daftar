"use server";

import { getCurrentUserAction } from "../users";
import { updateSupplier } from "@/server/db/tables/supplier/queries";
import type { ReturnTuple } from "@/utils/type-utils";

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

export const updateSupplierPrimaryContactAction = async (
  supplierId: number,
  contactId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await updateSupplier(supplierId, {
    primaryContactId: contactId,
  });
  if (error !== null) return [null, error];
  return [returnValue, null];
};

export const updateSupplierFieldAction = async (
  supplierId: number,
  field: string,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [supplier, supplierError] = await updateSupplier(supplierId, {
    field,
    updatedBy: currentUser.id,
  });

  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

export const updateSupplierRegistrationNumber = async (
  supplierId: number,
  registrationNumber: string,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [supplier, supplierError] = await updateSupplier(supplierId, {
    registrationNumber,
    updatedBy: currentUser.id,
  });

  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

export const updateSupplierWebsite = async (
  supplierId: number,
  website: string,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [supplier, supplierError] = await updateSupplier(supplierId, {
    website,
    updatedBy: currentUser.id,
  });

  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

export const updateSupplierNotes = async (
  supplierId: number,
  notes: string,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [supplier, supplierError] = await updateSupplier(supplierId, {
    notes,
    updatedBy: currentUser.id,
  });

  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

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

export const updateSupplierRegistrationNumberAction = async (
  supplierId: number,
  data: { registrationNumber: string | undefined },
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [supplier, supplierError] = await updateSupplier(supplierId, {
    registrationNumber: data.registrationNumber,
    updatedBy: currentUser.id,
  });

  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

export const updateSupplierWebsiteAction = async (
  supplierId: number,
  data: { website: string | undefined },
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [supplier, supplierError] = await updateSupplier(supplierId, {
    website: data.website,
    updatedBy: currentUser.id,
  });

  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

export const updateSupplierNotesAction = async (
  supplierId: number,
  data: { notes: string | undefined },
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [supplier, supplierError] = await updateSupplier(supplierId, {
    notes: data.notes,
    updatedBy: currentUser.id,
  });

  if (supplierError !== null) return [null, supplierError];
  return [supplier, null];
};

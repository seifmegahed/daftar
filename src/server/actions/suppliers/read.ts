"use server";

import {
  getSuppliersBrief,
  getSupplierFullById,
  getSuppliersCount,
  listAllSuppliers,
  getSupplierPrimaryAddressId,
  getSupplierPrimaryContactId,
} from "@/server/db/tables/supplier/queries";

import type {
  BriefSupplierType,
  GetSupplierType,
  SupplierListType,
} from "@/server/db/tables/supplier/queries";
import type { FilterArgs } from "@/components/filter-and-search";
import type { ReturnTuple } from "@/utils/type-utils";

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

export const getSuppliersBriefAction = async (
  page: number,
  filter?: FilterArgs,
  searchText?: string,
  limit?: number,
): Promise<ReturnTuple<BriefSupplierType[]>> => {
  const [suppliers, suppliersError] = await getSuppliersBrief(
    page,
    filter,
    searchText,
    limit,
  );
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
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

export const getSuppliersCountAction = async (
  filter?: FilterArgs,
): Promise<ReturnTuple<number>> => {
  const [suppliers, suppliersError] = await getSuppliersCount(filter);
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
};

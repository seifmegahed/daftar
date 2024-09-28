"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "../users";
import { insertSupplierSchema } from "@/server/db/tables/supplier/schema";
import {
  type BriefSupplierType,
  type GetSupplierType,
  type SupplierListType,
  getAllSuppliersBrief,
  getSupplierFullById,
  insertNewSupplier,
  listAllSuppliers,
} from "@/server/db/tables/supplier/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const getAllSuppliersBriefAction = async (): Promise<
  ReturnTuple<BriefSupplierType[]>
> => {
  const [suppliers, suppliersError] = await getAllSuppliersBrief();
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
};

const addSupplierSchema = insertSupplierSchema.omit({
  createdBy: true,
});

export type AddSupplierFormType = z.infer<typeof addSupplierSchema>;

export const addSupplierAction = async (
  data: AddSupplierFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = addSupplierSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [supplierId, supplierInsertError] = await insertNewSupplier({
    name: isValid.data.name,
    field: isValid.data.field,
    registrationNumber: isValid.data.registrationNumber,
    website: isValid.data.website,
    notes: isValid.data.notes,
    createdBy: userId,
  });
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

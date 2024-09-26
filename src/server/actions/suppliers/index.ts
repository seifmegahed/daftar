"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "../users";
import { insertSupplierSchema } from "@/server/db/tables/supplier/schema";
import {
  type BriefSupplierType,
  type GetSupplierType,
  getAllSuppliersBrief,
  getSupplierFullById,
  insertNewSupplier,
} from "@/server/db/tables/supplier/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const getAllSuppliersBriefAction = async (): Promise<
  ReturnTuple<BriefSupplierType[]>
> => {
  const [suppliers, suppliersError] = await getAllSuppliersBrief();
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
};

const addSupplierSchema = insertSupplierSchema.pick({
  name: true,
  field: true,
  registrationNumber: true,
  website: true,
  notes: true,
});

export type AddSupplierFormType = z.infer<typeof addSupplierSchema>;

export const addSupplierAction = async (
  supplierData: AddSupplierFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = addSupplierSchema.safeParse(supplierData);
  if (!isValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [supplierId, supplierInsertError] = await insertNewSupplier({
    name: supplierData.name,
    field: supplierData.field,
    registrationNumber: supplierData.registrationNumber ?? null,
    website: supplierData.website ?? null,
    notes: supplierData.notes ?? null,
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

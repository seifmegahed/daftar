"use server";

import { deleteSupplier } from "@/server/db/tables/supplier/queries";
import { getCurrentUserAction } from "../users";
import type { ReturnTuple } from "@/utils/type-utils";

export const deleteSupplierAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [supplier, error] = await deleteSupplier(supplierId);
  if (error !== null) return [null, error];
  return [supplier, null];
};

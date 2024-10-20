"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getSupplierProjectsCountAction } from "@/server/actions/purchase-items/read";
import { deleteSupplier } from "@/server/db/tables/supplier/mutations";
import { getCurrentUserAction } from "@/server/actions/users";

import type { ReturnTuple } from "@/utils/type-utils";

export const deleteSupplierAction = async (
  supplierId: number,
): Promise<ReturnTuple<number> | undefined> => {
  const [supplierProjects, supplierProjectsError] =
    await getSupplierProjectsCountAction(supplierId);
  if (supplierProjectsError !== null) return [null, supplierProjectsError];
  if (supplierProjects !== null && supplierProjects > 0)
    return [
      null,
      "You cannot delete a supplier that is referenced in other projects",
    ];

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [, error] = await deleteSupplier(supplierId);
  if (error !== null) return [null, error];
  revalidatePath("/suppliers");
  redirect("/suppliers");
};

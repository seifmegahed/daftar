import { getSupplierProjects } from "@/server/db/tables/project/queries";
import type { SupplierProjectsType } from "@/server/db/tables/project/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const getSupplierProjectsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SupplierProjectsType[]>> => {
  const [projects, projectsError] = await getSupplierProjects(supplierId);
  if (projectsError !== null) return [null, projectsError];
  return [projects, null];
};

export const getSupplierProjectsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [projects, projectsError] = await getSupplierProjects(supplierId);
  if (projectsError !== null) return [null, projectsError];
  return [projects.length, null];
};

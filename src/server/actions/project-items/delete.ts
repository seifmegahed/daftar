"use server";

import { deleteProjectItem } from "@/server/db/tables/project-item/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const deleteProjectItemAction = async (
  projectItemId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await deleteProjectItem(projectItemId);
  if (error !== null) return [null, error];
  return [returnValue, null];
};

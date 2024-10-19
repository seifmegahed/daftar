"use server";

import { deleteProjectItem } from "@/server/db/tables/project-item/mutations";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";

export const deleteProjectItemAction = async (
  projectItemId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await deleteProjectItem(projectItemId);
  if (error !== null) return [null, error];
  revalidatePath("project");
  return [returnValue, null];
};

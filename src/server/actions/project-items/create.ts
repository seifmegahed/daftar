"use server";

import { insertProjectItem } from "@/server/db/tables/project-item/queries";
import { insertProjectItemSchema } from "@/server/db/tables/project-item/schema";

import type { InsertProjectItemType } from "@/server/db/tables/project-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const addProjectItemAction = async (
  data: InsertProjectItemType,
): Promise<ReturnTuple<number>> => {
  const isValid = insertProjectItemSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [projectItemId, projectItemInsertError] = await insertProjectItem(data);
  if (projectItemInsertError !== null) return [null, projectItemInsertError];

  return [projectItemId, null];
};

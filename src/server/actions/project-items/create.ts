"use server";

import { insertProjectItem } from "@/server/db/tables/project-item/queries";
import { insertProjectItemSchema } from "@/server/db/tables/project-item/schema";

import type { InsertProjectItemType } from "@/server/db/tables/project-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addProjectItemAction = async (
  data: InsertProjectItemType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = insertProjectItemSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [, projectItemInsertError] = await insertProjectItem(data);
  if (projectItemInsertError !== null) return [null, projectItemInsertError];

  revalidatePath("project");
  redirect(`/project/${data.projectId}/purchased-items`);
};

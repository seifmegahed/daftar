"use server";

import { errorLogger } from "@/lib/exceptions";
import { insertProjectItem } from "@/server/db/tables/project-item/mutations";
import { insertProjectItemSchema } from "@/server/db/tables/project-item/schema";

import type { InsertProjectItemType } from "@/server/db/tables/project-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const projectItemErrorLog = errorLogger("Project Item Action Error:");

export const addProjectItemAction = async (
  data: InsertProjectItemType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = insertProjectItemSchema.safeParse(data);
  if (isValid.error) {
    projectItemErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [, projectItemInsertError] = await insertProjectItem(data);
  if (projectItemInsertError !== null) return [null, projectItemInsertError];

  revalidatePath("project");
  redirect(`/project/${data.projectId}/purchased-items`);
};

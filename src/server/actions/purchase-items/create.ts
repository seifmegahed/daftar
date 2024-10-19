"use server";

import { errorLogger } from "@/lib/exceptions";
import { insertPurchaseItem } from "@/server/db/tables/purchase-item/mutations";
import { insertPurchaseItemSchema } from "@/server/db/tables/purchase-item/schema";

import type { InsertPurchaseItemType } from "@/server/db/tables/purchase-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const projectItemErrorLog = errorLogger("Project Item Action Error:");

export const addPurchaseItemAction = async (
  data: InsertPurchaseItemType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = insertPurchaseItemSchema.safeParse(data);
  if (isValid.error) {
    projectItemErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [, projectItemInsertError] = await insertPurchaseItem(data);
  if (projectItemInsertError !== null) return [null, projectItemInsertError];

  revalidatePath("project");
  redirect(`/project/${data.projectId}/purchased-items`);
};

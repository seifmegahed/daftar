"use server";

import { insertItemSchema } from "@/server/db/tables/item/schema";
import { getCurrentUserIdAction } from "../users";
import { insertItem } from "@/server/db/tables/item/mutations";

import type { z } from "zod";
import type { ReturnTuple } from "@/utils/type-utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { errorLogger } from "@/lib/exceptions";

const itemErrorLog = errorLogger("Item Create Action Error:");

const addItemSchema = insertItemSchema.omit({
  createdBy: true,
});

type AddItemFormType = z.infer<typeof addItemSchema>;

export const addItemAction = async (
  itemData: AddItemFormType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = addItemSchema.safeParse(itemData);
  if (isValid.error) {
    itemErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [, itemInsertError] = await insertItem({
    name: itemData.name,
    type: itemData.type,
    description: itemData.description,
    mpn: itemData.mpn,
    make: itemData.make,
    notes: itemData.notes,
    createdBy: userId,
  });
  if (itemInsertError !== null) return [null, itemInsertError];
  revalidatePath("/items");
  redirect("/items");
};

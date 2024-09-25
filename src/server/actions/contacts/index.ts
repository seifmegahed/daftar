"use server";

import { insertNewContact } from "@/server/db/tables/contact/queries";
import {
  insertContactSchema,
  type InsertContactType,
} from "@/server/db/tables/contact/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "../users";

export const addNewContactAction = async (
  data: InsertContactType,
): Promise<ReturnTuple<number>> => {
  const isValid = insertContactSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [contactId, contactInsertError] = await insertNewContact({
    ...data,
    createdBy: userId,
  });
  if (contactInsertError !== null) return [null, contactInsertError];

  return [contactId, null];
};

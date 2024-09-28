"use server";

import { insertNewContact } from "@/server/db/tables/contact/queries";
import {
  insertContactSchemaRaw,
  insertContactSchemaRefineCallback,
} from "@/server/db/tables/contact/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "../users";
import type { z } from "zod";

const addContactSchema = insertContactSchemaRaw
  .omit({
    createdBy: true,
    updatedBy: true,
  })
  .refine(insertContactSchemaRefineCallback);

type AddContactType = z.infer<typeof addContactSchema>;

export const addNewContactAction = async (
  data: AddContactType,
): Promise<ReturnTuple<number>> => {
  const isValid = addContactSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [contactId, contactInsertError] = await insertNewContact({
    name: isValid.data.name,
    phoneNumber: isValid.data.phoneNumber,
    email: isValid.data.email,
    notes: isValid.data.notes,
    createdBy: userId,
    supplierId: isValid.data.clientId ? null : isValid.data.supplierId,
    clientId: isValid.data.supplierId ? null : isValid.data.clientId,
  });
  if (contactInsertError !== null) return [null, contactInsertError];

  return [contactId, null];
};

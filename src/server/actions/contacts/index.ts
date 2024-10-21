"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  getClientContacts,
  getClientContactsCount,
  getSupplierContacts,
  getSupplierContactsCount,
} from "@/server/db/tables/contact/queries";
import {
  insertNewContact,
  deleteContact,
} from "@/server/db/tables/contact/mutations";
import { getCurrentUserIdAction } from "../users";

import {
  insertContactSchemaRaw,
  insertContactSchemaRefineCallback,
} from "@/server/db/tables/contact/schema";

import { errorLogger } from "@/lib/exceptions";

import type { z } from "zod";
import type { ContactType } from "@/server/db/tables/contact/queries";
import type { ReturnTuple } from "@/utils/type-utils";

const addressErrorLog = errorLogger("Address Action Error:");

const addContactSchema = insertContactSchemaRaw
  .omit({
    createdBy: true,
    updatedBy: true,
  })
  .refine(insertContactSchemaRefineCallback);

type AddContactType = z.infer<typeof addContactSchema>;

export const addNewContactAction = async (
  data: AddContactType,
  type: "client" | "supplier",
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = addContactSchema.safeParse(data);
  if (isValid.error) {
    addressErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [, contactInsertError] = await insertNewContact({
    name: isValid.data.name,
    phoneNumber: isValid.data.phoneNumber,
    email: isValid.data.email,
    notes: isValid.data.notes,
    createdBy: userId,
    supplierId: isValid.data.clientId ? null : isValid.data.supplierId,
    clientId: isValid.data.supplierId ? null : isValid.data.clientId,
  });
  if (contactInsertError !== null) return [null, contactInsertError];
  const basePath =
    type === "client"
      ? `/client/${isValid.data.clientId}`
      : `/supplier/${isValid.data.supplierId}`;
  revalidatePath(basePath);
  redirect(basePath + "/contacts/");
};

export const getClientContactsCountAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [contactsCount, error] = await getClientContactsCount(clientId);
  if (error !== null) return [null, error];
  return [contactsCount, null];
};

export const getClientContactsAction = async (
  clientId: number,
): Promise<ReturnTuple<ContactType[]>> => {
  const [contacts, error] = await getClientContacts(clientId);
  if (error !== null) return [null, error];
  return [contacts, null];
};

export const getSupplierContactsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [contactsCount, error] = await getSupplierContactsCount(supplierId);
  if (error !== null) return [null, error];
  return [contactsCount, null];
};

export const getSupplierContactsAction = async (
  supplierId: number,
): Promise<ReturnTuple<ContactType[]>> => {
  const [contacts, error] = await getSupplierContacts(supplierId);
  if (error !== null) return [null, error];
  return [contacts, null];
};

export const deleteContactAction = async (
  contactId: number,
  pathname?: string,
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await deleteContact(contactId);
  if (error !== null) return [null, error];
  if (pathname) revalidatePath(pathname);
  return [returnValue, null];
};

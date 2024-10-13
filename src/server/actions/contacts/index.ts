"use server";

import {
  type ContactType,
  deleteContact,
  getClientContacts,
  getClientContactsCount,
  getSupplierContacts,
  getSupplierContactsCount,
  insertNewContact,
} from "@/server/db/tables/contact/queries";
import {
  insertContactSchemaRaw,
  insertContactSchemaRefineCallback,
} from "@/server/db/tables/contact/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "../users";
import type { z } from "zod";
import { redirect } from "next/navigation";

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
  if (!isValid.success) return [null, "Invalid data"];

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
  redirect(
    type === "supplier"
      ? `/supplier/${isValid.data.supplierId}/contacts`
      : `/client/${isValid.data.clientId}/contacts`,
  );
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
): Promise<ReturnTuple<number>> => {
  const [returnValue, error] = await deleteContact(contactId);
  if (error !== null) return [null, error];
  return [returnValue, null];
};

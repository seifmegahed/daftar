import type { ReturnTuple } from "@/utils/type-utils";
import {
  contactsTable,
  type InsertContactType,
} from "./schema";
import { db } from "@/server/db";
import { getErrorMessage } from "@/lib/exceptions";
import { count, eq } from "drizzle-orm";
import { usersTable } from "@/server/db/tables/user/schema";
import { z } from "zod";

export const insertNewContact = async (
  data: InsertContactType,
): Promise<ReturnTuple<number>> => {
  try {
    const [address] = await db.insert(contactsTable).values(data).returning();

    if (!address) return [null, "Error inserting new contact"];
    return [address.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getClientContactsCount = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [contacts] = await db
      .select({ count: count() })
      .from(contactsTable)
      .where(eq(contactsTable.clientId, clientId))
      .limit(1);

    if (!contacts) return [null, "Error getting client contacts count"];
    return [contacts.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getSupplierContactsCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [contacts] = await db
      .select({ count: count() })
      .from(contactsTable)
      .where(eq(contactsTable.supplierId, supplierId))
      .limit(1);

    if (!contacts) return [null, "Error getting supplier contacts count"];
    return [contacts.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const deleteContact = async (
  contactId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [contact] = await db
      .delete(contactsTable)
      .where(eq(contactsTable.id, contactId))
      .returning();

    if (!contact) return [null, "Error deleting contact"];
    return [contact.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

const getContactSchema = z.object({
  id: z.number(),
  name: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  createdBy: z.string(),
  updatedBy: z.string().nullable(),
});

export type ContactType = z.infer<typeof getContactSchema>;

export const getClientContacts = async (
  clientId: number,
): Promise<ReturnTuple<ContactType[]>> => {
  try {
    const contacts = await db
      .select({
        id: contactsTable.id,
        name: contactsTable.name,
        phoneNumber: contactsTable.phoneNumber,
        email: contactsTable.email,
        notes: contactsTable.notes,
        createdAt: contactsTable.createdAt,
        updatedAt: contactsTable.updatedAt,
        createdBy: usersTable.name,
        updatedBy: usersTable.name,
      })
      .from(contactsTable)
      .leftJoin(usersTable, eq(contactsTable.createdBy, usersTable.id))
      .where(eq(contactsTable.clientId, clientId))
      .orderBy(contactsTable.id);

    if (!contacts) return [null, "Error getting client contacts"];
    const parsedContacts = z.array(getContactSchema).safeParse(contacts);

    if (!parsedContacts.success) return [null, "Error parsing contacts"];

    return [parsedContacts.data, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getSupplierContacts = async (
  supplierId: number,
): Promise<ReturnTuple<ContactType[]>> => {
  try {
    const contacts = await db
      .select({
        id: contactsTable.id,
        name: contactsTable.name,
        phoneNumber: contactsTable.phoneNumber,
        email: contactsTable.email,
        notes: contactsTable.notes,
        createdAt: contactsTable.createdAt,
        updatedAt: contactsTable.updatedAt,
        createdBy: usersTable.name,
        updatedBy: usersTable.name,
      })
      .from(contactsTable)
      .leftJoin(usersTable, eq(contactsTable.createdBy, usersTable.id))
      .where(eq(contactsTable.supplierId, supplierId))
      .orderBy(contactsTable.id);

    if (!contacts) return [null, "Error getting client contacts"];
    const parsedContacts = z.array(getContactSchema).safeParse(contacts);

    if (!parsedContacts.success) return [null, "Error parsing contacts"];

    return [parsedContacts.data, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

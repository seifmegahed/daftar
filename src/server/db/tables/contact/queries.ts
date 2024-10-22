import { z } from "zod";
import { db } from "@/server/db";
import { count, eq } from "drizzle-orm";
import { contactsTable, usersTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";

import type { ReturnTuple } from "@/utils/type-utils";
import { performanceTimer } from "@/utils/performance";

const errorMessages = {
  mainTitle: "Contact Queries Error:",
  dataCorrupted: "It seems that some data is corrupted",
  get: "An error occurred while getting contacts",
  count: "An error occurred while counting contacts",
};

const logError = errorLogger(errorMessages.mainTitle);

export const getClientContactsCount = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  const timer = new performanceTimer("getClientContactsCount");
  try {
    timer.start();
    const [contacts] = await db
      .select({ count: count() })
      .from(contactsTable)
      .where(eq(contactsTable.clientId, clientId))
      .limit(1);
    timer.end();

    if (!contacts) return [null, errorMessage];
    return [contacts.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierContactsCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.get;
  const timer = new performanceTimer("getSupplierContactsCount");
  try {
    timer.start();
    const [contacts] = await db
      .select({ count: count() })
      .from(contactsTable)
      .where(eq(contactsTable.supplierId, supplierId))
      .limit(1);
    timer.end();

    if (!contacts) return [null, errorMessage];
    return [contacts.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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
  const errorMessage = errorMessages.get;
  const timer = new performanceTimer("getClientContacts");
  try {
    timer.start();
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
    timer.end();

    if (!contacts) return [null, errorMessage];
    const parsedContacts = z.array(getContactSchema).safeParse(contacts);

    if (!parsedContacts.success) return [null, errorMessages.dataCorrupted];

    return [parsedContacts.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierContacts = async (
  supplierId: number,
): Promise<ReturnTuple<ContactType[]>> => {
  const errorMessage = errorMessages.get;
  const timer = new performanceTimer("getSupplierContacts");
  try {
    timer.start();
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
    timer.end();

    if (!contacts) return [null, errorMessage];
    const parsedContacts = z.array(getContactSchema).safeParse(contacts);

    if (!parsedContacts.success) return [null, errorMessages.dataCorrupted];

    return [parsedContacts.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

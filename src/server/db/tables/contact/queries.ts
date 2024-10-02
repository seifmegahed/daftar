import type { ReturnTuple } from "@/utils/type-utils";
import { contactsTable, type InsertContactType } from "./schema";
import { db } from "@/server/db";
import { getErrorMessage } from "@/lib/exceptions";
import { count, eq } from "drizzle-orm";

export const insertNewContact = async (
  data: InsertContactType,
): Promise<ReturnTuple<number>> => {
  try {
    const [address] = await db
      .insert(contactsTable)
      .values(data)
      .returning({ id: contactsTable.id });

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

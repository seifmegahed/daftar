import { db } from "@/server/db";
import { eq } from "drizzle-orm";

import { contactsTable } from "./schema";
import { errorLogger } from "@/lib/exceptions";

import type { InsertContactType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Contact Queries Error:",
  insert: "An error occurred while adding contact",
  delete: "An error occurred while deleting contact",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertNewContact = async (
  data: InsertContactType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [address] = await db.insert(contactsTable).values(data).returning();

    if (!address) return [null, errorMessage];
    return [address.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteContact = async (
  contactId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [contact] = await db
      .delete(contactsTable)
      .where(eq(contactsTable.id, contactId))
      .returning();

    if (!contact) return [null, errorMessage];
    return [contact.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

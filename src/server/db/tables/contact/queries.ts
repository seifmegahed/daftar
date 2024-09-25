import type { ReturnTuple } from "@/utils/type-utils";
import { contactsTable, type InsertContactType } from "./schema";
import { db } from "@/server/db";
import { getErrorMessage } from "@/lib/exceptions";

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

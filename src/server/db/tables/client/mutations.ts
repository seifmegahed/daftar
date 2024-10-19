import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  clientsTable,
  addressesTable,
  contactsTable,
  documentRelationsTable,
} from "@/server/db/schema";

import { checkUniqueConstraintError, errorLogger } from "@/lib/exceptions";

import type { InsertClientDataType } from "./schema";
import type { InsertAddressType } from "@/server/db/tables/address/schema";
import type { InsertContactType } from "@/server/db/tables/contact/schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Client Mutations Error:",
  insert: "An error occurred while adding client",
  clientNameExists: "Client name already exists",
  update: "An error occurred while updating client",
  delete: "An error occurred while deleting client",
};

const logError = errorLogger(errorMessages.mainTitle);

type SetPartialClient = Pick<
  InsertClientDataType,
  "name" | "registrationNumber" | "website" | "notes" | "createdBy"
>;

export const insertNewClient = async (
  clientData: SetPartialClient,
  addressData: InsertAddressType,
  contactData: InsertContactType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const client = await db.transaction(async (tx) => {
      const [client] = await tx
        .insert(clientsTable)
        .values({
          ...clientData,
        })
        .returning();

      if (!client) {
        tx.rollback();
        return;
      }
      const [address] = await tx
        .insert(addressesTable)
        .values({ ...addressData, clientId: client.id })
        .returning();

      if (!address) {
        tx.rollback();
        return;
      }

      const [contact] = await tx
        .insert(contactsTable)
        .values({ ...contactData, clientId: client.id })
        .returning();

      if (!contact) {
        tx.rollback();
        return;
      }

      const [updatedClient] = await tx
        .update(clientsTable)
        .set({
          primaryAddressId: address.id,
          primaryContactId: contact.id,
        })
        .where(eq(clientsTable.id, client.id))
        .returning();

      return updatedClient;
    });

    if (!client) return [null, errorMessage];
    return [client.id, null];
  } catch (error) {
    logError(error);
    return [
      null,
      checkUniqueConstraintError(error)
        ? errorMessages.clientNameExists
        : errorMessage,
    ];
  }
};

export const updateClient = async (
  id: number,
  data: Partial<InsertClientDataType>,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [client] = await db
      .update(clientsTable)
      .set(data)
      .where(eq(clientsTable.id, id))
      .returning();

    if (!client) return [null, errorMessages.update];
    return [client.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteClient = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const client = await db.transaction(async (tx) => {
      await tx
        .delete(addressesTable)

        .where(eq(addressesTable.clientId, id));

      await tx.delete(contactsTable).where(eq(contactsTable.clientId, id));

      await tx
        .delete(documentRelationsTable)
        .where(eq(documentRelationsTable.clientId, id));

      const [client] = await tx
        .delete(clientsTable)
        .where(eq(clientsTable.id, id))
        .returning();

      return client;
    });

    if (!client) return [null, errorMessage];
    return [client.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

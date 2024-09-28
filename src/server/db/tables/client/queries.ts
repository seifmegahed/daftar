import { db } from "@/server/db";
import { type InsertClientDataType, clientsTable } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { asc, eq } from "drizzle-orm";
import { getErrorMessage } from "@/lib/exceptions";
import {
  addressesTable,
  type InsertAddressType,
} from "../address/schema";
import { contactsTable, type InsertClientContactType } from "../contact/schema";

/**
 * Getters
 */

export type BriefClientType = Pick<
  InsertClientDataType,
  "id" | "name" | "registrationNumber"
>;

export const getAllClientsBrief = async (): Promise<
  ReturnTuple<BriefClientType[]>
> => {
  try {
    const allClients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
        registrationNumber: clientsTable.registrationNumber,
      })
      .from(clientsTable)
      .where(eq(clientsTable.isActive, true))
      .orderBy(asc(clientsTable.id));

    return [allClients, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

type ContactDataType = {
  id: number;
  name: string;
  phoneNumber: string | null;
  email: string | null;
};

type AddressDataType = {
  id: number;
  name: string;
  addressLine: string;
  country: string;
  city: string | null;
};

type UserDataType = {
  id: number;
  name: string;
};

export interface GetClientType extends InsertClientDataType {
  contacts: ContactDataType[];
  addresses: AddressDataType[];
  creator: UserDataType;
  updater: UserDataType | null;
}

export const getClientFullById = async (
  id: number,
): Promise<ReturnTuple<GetClientType>> => {
  try {
    const client = await db.query.clientsTable.findFirst({
      where: (client, { eq }) => eq(client.id, id),
      with: {
        contacts: {
          columns: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
          },
        },
        addresses: {
          columns: {
            id: true,
            name: true,
            addressLine: true,
            country: true,
            city: true,
          },
        },
        creator: {
          columns: {
            id: true,
            name: true,
          },
        },
        updater: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!client) return [null, "Error: Client not found"];
    return [client, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("CONNECT_TIMEOUT"))
      return [null, "Error connecting to database"];
    console.log(error);
    return [null, errorMessage];
  }
};
/**
 * Setters
 */
type SetPartialClient = Pick<
  InsertClientDataType,
  "name" | "registrationNumber" | "website" | "notes" | "createdBy"
>;

export const insertNewClient = async (
  clientData: SetPartialClient,
  addressData: Omit<InsertAddressType, "clientId">,
  contactData: Omit<InsertClientContactType, "clientId">,
): Promise<ReturnTuple<number>> => {
  try {
    const client = await db.transaction(async (tx) => {
      const [client] = await tx
        .insert(clientsTable)
        .values({
          ...clientData,
        })
        .returning({ id: clientsTable.id });

      if (!client) {
        tx.rollback();
        return;
      }
      const [address] = await tx
        .insert(addressesTable)
        .values({ ...addressData, clientId: client.id })
        .returning({ id: addressesTable.id });

      if (!address) {
        tx.rollback();
        return;
      }

      const [contact] = await tx
        .insert(contactsTable)
        .values({ ...contactData, clientId: client.id })
        .returning({ id: contactsTable.id });

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
        .returning({ id: clientsTable.id });

      return updatedClient;
    });

    if (!client) throw new Error("Error inserting new client");
    return [client.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, `Client with name ${clientData.name} already exists`];
    return [null, getErrorMessage(error)];
  }
};

export type ClientListType = {
  id: number;
  name: string;
};

export const listAllClients = async (): Promise<
  ReturnTuple<ClientListType[]>
> => {
  try {
    const clients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
      })
      .from(clientsTable)
      .orderBy(asc(clientsTable.id));

    if (!clients) return [null, "Error getting clients"];
    return [clients, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting clients"];
  }
};

import { db } from "@/server/db";
import { type ClientDataType, clientsTable } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { asc, eq } from "drizzle-orm";
import { getErrorMessage } from "@/lib/exceptions";
import { contactsTable } from "../contact/schema";
import { addressesTable } from "../address/schema";

/**
 * Getters
 */

export type BriefClientType = Pick<
  ClientDataType,
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

type ClientFullType = {
  client: ClientDataType;
  contacts: ContactDataType[];
  addresses: AddressDataType[];
};

export const getClientFull = async (
  id: number,
): Promise<ReturnTuple<ClientFullType>> => {
  try {
    const contactsSubQuery = db
      .select({
        id: contactsTable.id,
        name: contactsTable.name,
        phoneNumber: contactsTable.phoneNumber,
        email: contactsTable.email,
      })
      .from(contactsTable)
      .where(eq(contactsTable.clientId, id))
      .as("contacts");

    const addressesSubQuery = db
      .select({
        id: addressesTable.id,
        name: addressesTable.name,
        addressLine: addressesTable.addressLine,
        city: addressesTable.city,
        country: addressesTable.country,
      })
      .from(addressesTable)
      .where(eq(addressesTable.clientId, id))
      .as("addresses");

    const client = await db
      .select()
      .from(clientsTable)
      .leftJoin(contactsSubQuery, eq(clientsTable.id, contactsTable.clientId))
      .leftJoin(addressesSubQuery, eq(clientsTable.id, addressesTable.clientId))
      .where(eq(clientsTable.id, id));

    if (!client.length) throw new Error("Error getting client");

    const reducedClient = client.reduce((accumulator, current) => {
      return {
        client: current.client,
        contacts: current.contacts
          ? accumulator.contacts.concat(current.contacts)
          : accumulator.contacts,
        addresses: current.addresses
          ? accumulator.addresses.concat(current.addresses)
          : accumulator.addresses,
      };
    }, {} as ClientFullType);

    return [reducedClient, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

/**
 * Setters
 */
type SetPartialClient = Pick<
  ClientDataType,
  "name" | "registrationNumber" | "website" | "notes" | "createdBy"
>;

export const insertNewClient = async (
  data: SetPartialClient,
): Promise<ReturnTuple<number>> => {
  try {
    const [client] = await db
      .insert(clientsTable)
      .values(data)
      .returning({ id: clientsTable.id });

    if (!client) throw new Error("Error inserting new client");
    return [client.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, `Client with name ${data.name} already exists`];
    return [null, getErrorMessage(error)];
  }
};

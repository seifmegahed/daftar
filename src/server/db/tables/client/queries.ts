import { db } from "@/server/db";
import { asc, count, eq, sql, desc, and } from "drizzle-orm";

import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";
import { checkUniqueConstraintError, errorLogger } from "@/lib/exceptions";
import { defaultPageLimit } from "@/data/config";

import { clientsTable } from "./schema";
import {
  addressesTable,
  contactsTable,
  documentRelationsTable,
} from "@/server/db/schema";

import type { InsertAddressType } from "../address/schema";
import type { InsertContactType } from "../contact/schema";
import type { InsertClientDataType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { filterDefault, type FilterArgs } from "@/components/filter-and-search";

const errorMessages = {
  mainTitle: "Client Queries Error:",
  getPrimaryContactId: "An error occurred while getting primary contact ID",
  getPrimaryAddressId: "An error occurred while getting primary address ID",
  getClients: "An error occurred while getting clients",
  getClient: "An error occurred while getting client",
  notFound: "Client not found",
  insert: "An error occurred while inserting client",
  clientNameExists: "Client name already exists",
  count: "An error occurred while counting clients",
  update: "An error occurred while updating client",
  delete: "An error occurred while deleting client",
};

const logError = errorLogger(errorMessages.mainTitle);

/**
 * Getters
 */
export const getClientPrimaryAddressId = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.getPrimaryAddressId;
  try {
    const [address] = await db
      .select({ primaryAddressId: clientsTable.primaryAddressId })
      .from(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .limit(1);

    if (!address?.primaryAddressId) return [null, errorMessage];
    return [address.primaryAddressId, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getClientPrimaryContactId = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.getPrimaryContactId;
  try {
    const [contact] = await db
      .select({ id: clientsTable.primaryContactId })
      .from(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .limit(1);

    if (!contact?.id) return [null, errorMessage];
    return [contact.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const projectSearchQuery = (searchText: string) =>
  sql`
      to_tsvector('english', ${clientsTable.name}) ,
      to_tsquery(${prepareSearchText(searchText)})
  `;

export type BriefClientType = Required<
  Pick<InsertClientDataType, "id" | "name" | "registrationNumber" | "createdAt">
>;

export const getClientsBrief = async (
  page: number,
  filter: FilterArgs = filterDefault,
  searchText?: string,
  limit = defaultPageLimit,
): Promise<ReturnTuple<BriefClientType[]>> => {
  const errorMessage = errorMessages.getClients;
  try {
    const clients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
        registrationNumber: clientsTable.registrationNumber,
        createdAt: clientsTable.createdAt,
        rank: searchText
          ? sql`ts_rank(${projectSearchQuery(searchText ?? "")})`
          : sql`1`,
      })
      .from(clientsTable)
      .where(and(eq(clientsTable.isActive, true), clientFilterQuery(filter)))
      .orderBy((table) =>
        searchText ? desc(table.rank) : desc(clientsTable.id),
      )
      .limit(limit)
      .offset((page - 1) * limit);

    return [clients, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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

export interface GetClientType extends Required<InsertClientDataType> {
  primaryContact: ContactDataType | null;
  primaryAddress: AddressDataType | null;
  creator: UserDataType;
  updater: UserDataType | null;
}

export const getClientFullById = async (
  id: number,
): Promise<ReturnTuple<GetClientType>> => {
  const errorMessage = errorMessages.getClient;
  try {
    const client = await db.query.clientsTable.findFirst({
      where: (client, { eq }) => eq(client.id, id),
      with: {
        primaryAddress: {
          columns: {
            id: true,
            name: true,
            addressLine: true,
            country: true,
            city: true,
          },
        },
        primaryContact: {
          columns: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
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
    if (!client) return [null, errorMessages.notFound];
    return [client, null];
  } catch (error) {
    console.log(errorMessages.mainTitle, error);
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

export type ClientListType = {
  id: number;
  name: string;
};

export const listAllClients = async (): Promise<
  ReturnTuple<ClientListType[]>
> => {
  const errorMessage = errorMessages.getClients;
  try {
    const clients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
      })
      .from(clientsTable)
      .orderBy(asc(clientsTable.id));

    if (!clients) return [null, errorMessage];
    return [clients, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const clientFilterQuery = (filter: FilterArgs) => {
  switch (filter.filterType) {
    case "creationDate":
      return timestampQueryGenerator(
        clientsTable.createdAt,
        filter.filterValue,
      );
    case "updateDate":
      return timestampQueryGenerator(
        clientsTable.updatedAt,
        filter.filterValue,
      );
    default:
      return sql`true`;
  }
};

export const getClientsCount = async (
  filter: FilterArgs = filterDefault,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [clients] = await db
      .select({ count: count() })
      .from(clientsTable)
      .where(clientFilterQuery(filter))
      .limit(1);

    if (!clients) return [null, errorMessage];
    return [clients.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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

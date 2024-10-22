import { db } from "@/server/db";
import { asc, count, eq, sql, desc, and } from "drizzle-orm";
import { clientsTable } from "@/server/db/schema";

import { errorLogger } from "@/lib/exceptions";
import { defaultPageLimit } from "@/data/config";
import { filterDefault } from "@/components/filter-and-search";
import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";

import type { InsertClientDataType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import type { FilterArgs } from "@/components/filter-and-search";
import { performanceTimer } from "@/utils/performance";

const errorMessages = {
  mainTitle: "Client Queries Error:",
  getPrimaryContactId: "An error occurred while getting primary contact ID",
  getPrimaryAddressId: "An error occurred while getting primary address ID",
  getClients: "An error occurred while getting clients",
  getClient: "An error occurred while getting client",
  notFound: "Client not found",
  count: "An error occurred while counting clients",
};

const logError = errorLogger(errorMessages.mainTitle);

export const getClientPrimaryAddressId = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.getPrimaryAddressId;
  const timer = new performanceTimer("getClientPrimaryAddressId");
  try {
    timer.start();
    const [address] = await db
      .select({ primaryAddressId: clientsTable.primaryAddressId })
      .from(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .limit(1);
    timer.end();

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
  const timer = new performanceTimer("getClientPrimaryContactId");
  try {
    timer.start();
    const [contact] = await db
      .select({ id: clientsTable.primaryContactId })
      .from(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .limit(1);
    timer.end();

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
  const timer = new performanceTimer("getClientsBrief");
  try {
    timer.start();
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
    timer.end();

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
  const timer = new performanceTimer("getClientFullById");
  try {
    timer.start();
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
    timer.end();

    if (!client) return [null, errorMessages.notFound];
    return [client, null];
  } catch (error) {
    console.log(errorMessages.mainTitle, error);
    return [null, errorMessage];
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
  const timer = new performanceTimer("listAllClients");
  try {
    timer.start();
    const clients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
      })
      .from(clientsTable)
      .orderBy(asc(clientsTable.id));
    timer.end();

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
  const timer = new performanceTimer("getClientsCount");
  try {
    timer.start();
    const [clients] = await db
      .select({ count: count() })
      .from(clientsTable)
      .where(clientFilterQuery(filter))
      .limit(1);
    timer.end();

    if (!clients) return [null, errorMessage];
    return [clients.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

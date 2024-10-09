"use server";

import type { FilterArgs } from "@/components/filter-and-search";
import type {
  BriefClientType,
  ClientListType,
  GetClientType,
} from "@/server/db/tables/client/queries";
import {
  getClientsBrief,
  getClientFullById,
  getClientsCount,
  listAllClients,
  getClientPrimaryAddressId,
  getClientPrimaryContactId,
} from "@/server/db/tables/client/queries";

import type { ReturnTuple } from "@/utils/type-utils";

export const getClientPrimaryAddressIdAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [addressId, addressError] = await getClientPrimaryAddressId(clientId);
  if (addressError !== null) return [null, addressError];
  return [addressId, null];
};

export const getClientPrimaryContactIdAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [contactId, contactError] = await getClientPrimaryContactId(clientId);
  if (contactError !== null) return [null, contactError];
  return [contactId, null];
};

export const getClientsBriefAction = async (
  page: number,
  filter?: FilterArgs,
  query?: string,
  limit?: number,
): Promise<ReturnTuple<BriefClientType[]>> => {
  const [clients, clientsError] = await getClientsBrief(
    page,
    filter,
    query,
    limit,
  );
  if (clientsError !== null) return [null, clientsError];
  return [clients, null];
};

export const getClientFullByIdAction = async (
  id: number,
): Promise<ReturnTuple<GetClientType>> => {
  const [client, clientError] = await getClientFullById(id);
  if (clientError !== null) return [null, clientError];
  return [client, null];
};

export const listAllClientsAction = async (): Promise<
  ReturnTuple<ClientListType[]>
> => {
  const [clients, clientsError] = await listAllClients();
  if (clientsError !== null) return [null, clientsError];
  return [clients, null];
};

export const getClientsCountAction = async (
  filter?: FilterArgs,
): Promise<ReturnTuple<number>> => {
  const [clients, clientsError] = await getClientsCount(filter);
  if (clientsError !== null) return [null, clientsError];
  return [clients, null];
};

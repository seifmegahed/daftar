"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "../users";
import { insertClientSchema } from "@/server/db/tables/client/schema";
import {
  type BriefClientType,
  type ClientListType,
  type GetClientType,
  getAllClientsBrief,
  getClientFullById,
  getClientsCount,
  insertNewClient,
  listAllClients,
} from "@/server/db/tables/client/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { insertAddressSchemaRaw } from "@/server/db/tables/address/schema";
import { insertContactSchemaRaw } from "@/server/db/tables/contact/schema";

export const getAllClientsBriefAction = async (): Promise<
  ReturnTuple<BriefClientType[]>
> => {
  const [clients, clientsError] = await getAllClientsBrief();
  if (clientsError !== null) return [null, clientsError];
  return [clients, null];
};

const addClientSchema = insertClientSchema.pick({
  name: true,
  registrationNumber: true,
  website: true,
  notes: true,
});

export type AddClientFormType = z.infer<typeof addClientSchema>;

const addClientAddressSchema = insertAddressSchemaRaw.omit({
  clientId: true,
  supplierId: true,
  createdBy: true,
  createdAt: true,
});

type AddClientAddressType = z.infer<typeof addClientAddressSchema>;

const addClientContactSchema = insertContactSchemaRaw.omit({
  clientId: true,
  supplierId: true,
  createdBy: true,
  createdAt: true,
});

type AddClientContactType = z.infer<typeof addClientContactSchema>;

export const addClientAction = async (
  clientData: AddClientFormType,
  addressData: AddClientAddressType,
  contactData: AddClientContactType,
): Promise<ReturnTuple<number>> => {
  const isClientValid = addClientSchema.safeParse(clientData);
  if (!isClientValid.success) return [null, "Invalid Client data"];

  const isAddressValid = addClientAddressSchema.safeParse(addressData);
  if (!isAddressValid.success) return [null, "Invalid Address data"];

  const isContactValid = addClientContactSchema.safeParse(contactData);
  if (!isContactValid.success) return [null, "Invalid Contact data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [clientId, clientInsertError] = await insertNewClient(
    {
      name: clientData.name,
      registrationNumber: clientData.registrationNumber ?? null,
      website: clientData.website ?? null,
      notes: clientData.notes ?? null,
      createdBy: userId,
    },
    {
      name: addressData.name,
      addressLine: addressData.addressLine,
      country: addressData.country,
      city: addressData.city,
      notes: addressData.notes,
      createdBy: userId,
    },
    {
      name: contactData.name,
      phoneNumber: contactData.phoneNumber,
      email: contactData.email,
      notes: contactData.notes,
      createdBy: userId,
    },
  );
  if (clientInsertError !== null) return [null, clientInsertError];

  return [clientId, null];
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

export const getClientsCountAction = async (): Promise<
  ReturnTuple<number>
> => {
  const [clients, clientsError] = await getClientsCount();
  if (clientsError !== null) return [null, clientsError];
  return [clients, null];
};

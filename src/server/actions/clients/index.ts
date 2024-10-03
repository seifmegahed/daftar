"use server";

import type { z } from "zod";
import { getCurrentUserAction, getCurrentUserIdAction } from "../users";
import { insertClientSchema } from "@/server/db/tables/client/schema";
import {
  type BriefClientType,
  type ClientListType,
  type GetClientType,
  getClientsBrief,
  getClientFullById,
  getClientsCount,
  insertNewClient,
  listAllClients,
  getClientPrimaryAddressId,
  getClientPrimaryContactId,
  updateClient,
  deleteClient,
} from "@/server/db/tables/client/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { insertAddressSchemaRaw } from "@/server/db/tables/address/schema";
import { insertContactSchemaRaw } from "@/server/db/tables/contact/schema";

export const getClientPrimaryAddressIdAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [addressId, addressError] = await getClientPrimaryAddressId(clientId);
  if (addressError !== null) return [null, addressError];
  return [addressId, null];
};

export const updateClientPrimaryAddressAction = async (
  clientId: number,
  addressId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, addressError] = await updateClient(clientId, {
    primaryAddressId: addressId,
  });
  if (addressError !== null) return [null, addressError];
  return [returnValue, null];
};

export const updateClientPrimaryContactAction = async (
  clientId: number,
  contactId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, contactError] = await updateClient(clientId, {
    primaryContactId: contactId,
  });
  if (contactError !== null) return [null, contactError];
  return [returnValue, null];
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
  query?: string,
  limit?: number,
): Promise<ReturnTuple<BriefClientType[]>> => {
  const [clients, clientsError] = await getClientsBrief(page, query, limit);
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

export const getClientsCountAction = async (): Promise<ReturnTuple<number>> => {
  const [clients, clientsError] = await getClientsCount();
  if (clientsError !== null) return [null, clientsError];
  return [clients, null];
};

const updateClientWebsiteSchema = insertClientSchema.pick({
  website: true,
});

type UpdateClientWebsiteFormType = z.infer<typeof updateClientWebsiteSchema>;

export const updateClientWebsiteAction = async (
  clientId: number,
  data: UpdateClientWebsiteFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateClientWebsiteSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateClient(clientId, {
    updatedBy: currentUserId,
    website: isValid.data.website,
  });
  if (error !== null) return [null, error];

  return [returnValue, null];
};

const updateClientRegistrationNumberSchema = insertClientSchema.pick({
  registrationNumber: true,
});

type UpdateClientRegistrationNumberFormType = z.infer<
  typeof updateClientRegistrationNumberSchema
>;

export const updateClientRegistrationNumberAction = async (
  clientId: number,
  data: UpdateClientRegistrationNumberFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateClientRegistrationNumberSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateClient(clientId, {
    updatedBy: currentUserId,
    registrationNumber: isValid.data.registrationNumber,
  });
  if (error !== null) return [null, error];

  return [returnValue, null];
};

const updateClientNotesSchema = insertClientSchema.pick({
  notes: true,
});

type UpdateClientNotesFormType = z.infer<typeof updateClientNotesSchema>;

export const updateClientNotesAction = async (
  clientId: number,
  data: UpdateClientNotesFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateClientNotesSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateClient(clientId, {
    updatedBy: currentUserId,
    notes: isValid.data.notes,
  });
  if (error !== null) return [null, error];

  return [returnValue, null];
};

export const deleteClientAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, "Unauthorized"];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [client, error] = await deleteClient(clientId);
  if (error !== null) return [null, error];
  return [client, null];
};

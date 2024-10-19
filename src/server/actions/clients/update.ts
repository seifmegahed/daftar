"use server";

import { revalidatePath } from "next/cache";

import { updateClient } from "@/server/db/tables/client/mutations";
import { getCurrentUserIdAction } from "@/server/actions/users";

import { insertClientSchema } from "@/server/db/tables/client/schema";

import { errorLogger } from "@/lib/exceptions";

import type { z } from "zod";
import type { ReturnTuple } from "@/utils/type-utils";

const clientActionErrorLog = errorLogger("Client Update Action Error:");

export const updateClientPrimaryAddressAction = async (
  clientId: number,
  addressId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, addressError] = await updateClient(clientId, {
    primaryAddressId: addressId,
  });
  if (addressError !== null) return [null, addressError];
  revalidatePath(`/client`);
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
  revalidatePath(`/client`);
  return [returnValue, null];
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
  if (isValid.error) {
    clientActionErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateClient(clientId, {
    updatedBy: currentUserId,
    website: isValid.data.website,
  });
  if (error !== null) return [null, error];
  revalidatePath(`/client`);
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
  if (isValid.error) {
    clientActionErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateClient(clientId, {
    updatedBy: currentUserId,
    registrationNumber: isValid.data.registrationNumber,
  });
  if (error !== null) return [null, error];
  revalidatePath(`/client`);
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
  if (isValid.error) {
    clientActionErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateClient(clientId, {
    updatedBy: currentUserId,
    notes: isValid.data.notes,
  });
  if (error !== null) return [null, error];
  revalidatePath(`/client`);
  return [returnValue, null];
};

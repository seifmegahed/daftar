"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "@/server/actions/users";
import { insertClientSchema } from "@/server/db/tables/client/schema";
import { updateClient } from "@/server/db/tables/client/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";

export const updateClientPrimaryAddressAction = async (
  clientId: number,
  addressId: number,
): Promise<ReturnTuple<number>> => {
  const [returnValue, addressError] = await updateClient(clientId, {
    primaryAddressId: addressId,
  });
  if (addressError !== null) return [null, addressError];
  revalidatePath(`/client/${clientId}`);
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
  revalidatePath(`/client/${clientId}`);
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
  if (!isValid.success) return [null, "Invalid data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [returnValue, error] = await updateClient(clientId, {
    updatedBy: currentUserId,
    website: isValid.data.website,
  });
  if (error !== null) return [null, error];
  revalidatePath(`/client/${clientId}`);
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
  revalidatePath(`/client/${clientId}`);
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
  revalidatePath(`/client/${clientId}`);
  return [returnValue, null];
};

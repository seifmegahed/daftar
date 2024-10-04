"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "@/server/actions/users";
import { insertClientSchema } from "@/server/db/tables/client/schema";
import { insertNewClient } from "@/server/db/tables/client/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { insertAddressSchemaRaw } from "@/server/db/tables/address/schema";
import { insertContactSchemaRaw } from "@/server/db/tables/contact/schema";

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

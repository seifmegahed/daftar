"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "../users";
import { insertClientSchema } from "@/server/db/tables/client/schema";
import {
  type BriefClientType,
  getAllClientsBrief,
  insertNewClient,
} from "@/server/db/tables/client/queries";
import type { ReturnTuple } from "@/utils/type-utils";

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

export const addClientAction = async (
  clientData: AddClientFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = addClientSchema.safeParse(clientData);
  if (!isValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [clientId, clientInsertError] = await insertNewClient({
    name: clientData.name,
    registrationNumber: clientData.registrationNumber ?? null,
    website: clientData.website ?? null,
    notes: clientData.notes ?? null,
    createdBy: userId,
  });
  if (clientInsertError !== null) return [null, clientInsertError];

  return [clientId, null];
};

"use server";

import { insertNewAddress } from "@/server/db/tables/address/queries";
import {
  insertAddressSchemaRaw,
  insertAddressSchemaRefineCallback,
} from "@/server/db/tables/address/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "../users";
import type { z } from "zod";

const addAddressSchema = insertAddressSchemaRaw
  .omit({
    createdBy: true,
    updatedBy: true,
  })
  .refine(insertAddressSchemaRefineCallback);

type AddAddressType = z.infer<typeof addAddressSchema>;

export const addNewAddressAction = async (
  data: AddAddressType,
): Promise<ReturnTuple<number>> => {
  const isValid = addAddressSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [addressId, addressInsertError] = await insertNewAddress({
    name: isValid.data.name,
    addressLine: isValid.data.addressLine,
    country: isValid.data.country,
    city: isValid.data.city,
    notes: isValid.data.notes,
    createdBy: currentUserId,
    supplierId: isValid.data.clientId ? null : isValid.data.supplierId,
    clientId: isValid.data.supplierId ? null : isValid.data.clientId,
  });
  if (addressInsertError !== null) return [null, addressInsertError];

  return [addressId, null];
};

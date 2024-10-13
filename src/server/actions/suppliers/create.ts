"use server";

import type { z } from "zod";
import { getCurrentUserIdAction } from "../users";
import { insertSupplierSchema } from "@/server/db/tables/supplier/schema";
import { insertNewSupplier } from "@/server/db/tables/supplier/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { insertContactSchemaRaw } from "@/server/db/tables/contact/schema";
import { insertAddressSchemaRaw } from "@/server/db/tables/address/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const addSupplierSchema = insertSupplierSchema.omit({
  createdBy: true,
});

export type AddSupplierFormType = z.infer<typeof addSupplierSchema>;

const addClientAddressSchema = insertAddressSchemaRaw.omit({
  clientId: true,
  supplierId: true,
  createdBy: true,
  createdAt: true,
});

type AddSupplierAddressType = z.infer<typeof addClientAddressSchema>;

const addClientContactSchema = insertContactSchemaRaw.omit({
  clientId: true,
  supplierId: true,
  createdBy: true,
  createdAt: true,
});

type AddSupplierContactType = z.infer<typeof addClientContactSchema>;

export const addSupplierAction = async (
  clientData: AddSupplierFormType,
  addressData: AddSupplierAddressType,
  contactData: AddSupplierContactType,
): Promise<ReturnTuple<number> | undefined> => {
  const isSupplierValid = addSupplierSchema.safeParse(clientData);
  if (!isSupplierValid.success) return [null, "Invalid data"];

  const isAddressValid = addClientAddressSchema.safeParse(addressData);
  if (!isAddressValid.success) return [null, "Invalid data"];

  const isContactValid = addClientContactSchema.safeParse(contactData);
  if (!isContactValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [, supplierInsertError] = await insertNewSupplier(
    {
      name: clientData.name,
      field: clientData.field,
      registrationNumber: clientData.registrationNumber,
      website: clientData.website,
      notes: clientData.notes,
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
  if (supplierInsertError !== null) return [null, supplierInsertError];

  revalidatePath("/suppliers");
  redirect("/suppliers");
};

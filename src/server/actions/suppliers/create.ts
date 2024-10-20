"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { insertNewSupplier } from "@/server/db/tables/supplier/mutations";
import { getCurrentUserIdAction } from "@/server/actions/users";

import { insertSupplierSchema } from "@/server/db/tables/supplier/schema";
import { insertContactSchemaRaw } from "@/server/db/tables/contact/schema";
import { insertAddressSchemaRaw } from "@/server/db/tables/address/schema";

import { errorLogger } from "@/lib/exceptions";

import type { z } from "zod";
import type { ReturnTuple } from "@/utils/type-utils";

const suppliersErrorLog = errorLogger("Supplier Create Action Error:");

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
  if (isSupplierValid.error) {
    suppliersErrorLog(isSupplierValid.error);
    return [null, "Invalid data"];
  }

  const isAddressValid = addClientAddressSchema.safeParse(addressData);
  if (isAddressValid.error) {
    suppliersErrorLog(isAddressValid.error);
    return [null, "Invalid data"];
  }

  const isContactValid = addClientContactSchema.safeParse(contactData);
  if (isContactValid.error) {
    suppliersErrorLog(isContactValid.error);
    return [null, "Invalid data"];
  }

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

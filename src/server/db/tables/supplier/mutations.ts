import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import {
  suppliersTable,
  documentRelationsTable,
  addressesTable,
  contactsTable,
} from "@/server/db/schema";

import { checkUniqueConstraintError, errorLogger } from "@/lib/exceptions";

import type { InsertSupplierType } from "./schema";
import type { InsertAddressType } from "@/server/db/tables/address/schema";
import type { InsertContactType } from "@/server/db/tables/contact/schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Supplier Mutations Error:",
  insert: "An error occurred while adding supplier",
  nameExists: "Supplier name already exists",
  update: "An error occurred while updating suppliers",
  delete: "An error occurred while deleting suppliers",
};

const logError = errorLogger(errorMessages.mainTitle);

export const insertNewSupplier = async (
  supplierData: InsertSupplierType,
  addressData: InsertAddressType,
  contactData: InsertContactType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const supplier = await db.transaction(async (tx) => {
      const [supplier] = await tx
        .insert(suppliersTable)
        .values(supplierData)
        .returning();

      if (!supplier) {
        tx.rollback();
        return;
      }

      const [address] = await tx
        .insert(addressesTable)
        .values({ ...addressData, supplierId: supplier.id })
        .returning();

      if (!address) {
        tx.rollback();
        return;
      }

      const [contact] = await tx
        .insert(contactsTable)
        .values({ ...contactData, supplierId: supplier.id })
        .returning();

      if (!contact) {
        tx.rollback();
        return;
      }

      const [updatedSupplier] = await tx
        .update(suppliersTable)
        .set({
          primaryAddressId: address.id,
          primaryContactId: contact.id,
        })
        .where(eq(suppliersTable.id, supplier.id))
        .returning();

      if (!updatedSupplier) {
        tx.rollback();
        return;
      }

      return updatedSupplier;
    });
    if (!supplier) return [null, errorMessage];
    return [supplier.id, null];
  } catch (error) {
    logError(error);
    return [
      null,
      checkUniqueConstraintError(error)
        ? errorMessages.nameExists
        : errorMessage,
    ];
  }
};

export type SupplierListType = {
  id: number;
  name: string;
};

export const updateSupplier = async (
  supplierId: number,
  data: Partial<InsertSupplierType>,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.update;
  try {
    const [returnValue] = await db
      .update(suppliersTable)
      .set(data)
      .where(eq(suppliersTable.id, supplierId))
      .returning();

    if (!returnValue) return [null, errorMessage];
    return [returnValue.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteSupplier = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const supplier = await db.transaction(async (tx) => {
      await tx
        .delete(addressesTable)
        .where(eq(addressesTable.supplierId, supplierId))
        .returning();

      await tx
        .delete(contactsTable)
        .where(eq(contactsTable.supplierId, supplierId))
        .returning();

      await tx
        .delete(documentRelationsTable)
        .where(eq(documentRelationsTable.supplierId, supplierId))
        .returning();

      const [supplier] = await tx
        .delete(suppliersTable)
        .where(eq(suppliersTable.id, supplierId))
        .returning();

      return supplier;
    });

    if (!supplier) return [null, errorMessage];
    return [supplier.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

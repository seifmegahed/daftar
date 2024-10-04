import { db } from "@/server/db";
import {
  type InsertSupplierType,
  type SelectSupplierType,
  suppliersTable,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { asc, count, sql, desc, eq } from "drizzle-orm";
import { getErrorMessage } from "@/lib/exceptions";
import { defaultPageLimit } from "@/data/config";
import { prepareSearchText } from "@/utils/common";
import { addressesTable, type InsertAddressType } from "../address/schema";
import { contactsTable, type InsertContactType } from "../contact/schema";

/**
 * Getters
 */

export const getSupplierPrimaryAddressId = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [supplier] = await db
      .select({ primaryAddressId: suppliersTable.primaryAddressId })
      .from(suppliersTable)
      .where(eq(suppliersTable.id, supplierId))
      .limit(1);

    if (!supplier?.primaryAddressId)
      return [null, "Error getting supplier primary address"];
    return [supplier.primaryAddressId, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const getSupplierPrimaryContactId = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [supplier] = await db
      .select({ id: suppliersTable.primaryContactId })
      .from(suppliersTable)
      .where(eq(suppliersTable.id, supplierId))
      .limit(1);

    if (!supplier?.id) return [null, "Error getting supplier primary contact"];
    return [supplier.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

const supplierSearchQuery = (searchText: string) =>
  sql`
    (
      setweight(to_tsvector('english', ${suppliersTable.name}), 'A') ||
      setweight(to_tsvector('english', ${suppliersTable.field}), 'B')
    ), to_tsquery(${prepareSearchText(searchText)})
  `;

export type BriefSupplierType = Required<
  Pick<
    SelectSupplierType,
    "id" | "name" | "registrationNumber" | "createdAt" | "field"
  >
>;

export const getSuppliersBrief = async (
  page: number,
  searchText?: string,
  limit = defaultPageLimit,
): Promise<ReturnTuple<BriefSupplierType[]>> => {
  try {
    const allSuppliers = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
        registrationNumber: suppliersTable.registrationNumber,
        createdAt: suppliersTable.createdAt,
        field: suppliersTable.field,
        rank: searchText
          ? sql`ts_rank(${supplierSearchQuery(searchText ?? "")})`
          : sql`1`,
      })
      .from(suppliersTable)
      .orderBy((table) => (searchText ? desc(table.rank) : desc(table.id)))
      .limit(limit)
      .offset((page - 1) * limit);

    return [allSuppliers, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

type ContactDataType = {
  id: number;
  name: string;
  phoneNumber: string | null;
  email: string | null;
};

type AddressDataType = {
  id: number;
  name: string;
  addressLine: string;
  country: string;
  city: string | null;
};

type UserDataType = {
  id: number;
  name: string;
};

export interface GetSupplierType extends SelectSupplierType {
  primaryAddress: AddressDataType | null;
  primaryContact: ContactDataType | null;
  creator: UserDataType;
  updater: UserDataType | null;
}

export const getSupplierFullById = async (
  id: number,
): Promise<ReturnTuple<GetSupplierType>> => {
  try {
    const supplier = await db.query.suppliersTable.findFirst({
      where: (supplier, { eq }) => eq(supplier.id, id),
      with: {
        primaryContact: {
          columns: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
          },
        },
        primaryAddress: {
          columns: {
            id: true,
            name: true,
            addressLine: true,
            country: true,
            city: true,
          },
        },
        creator: {
          columns: {
            id: true,
            name: true,
          },
        },
        updater: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!supplier) return [null, "Error: Supplier not found"];
    return [supplier, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("CONNECT_TIMEOUT"))
      return [null, "Error connecting to database"];
    console.log(error);
    return [null, errorMessage];
  }
};

export const insertNewSupplier = async (
  supplierData: InsertSupplierType,
  addressData: InsertAddressType,
  contactData: InsertContactType,
): Promise<ReturnTuple<number>> => {
  try {
    const supplier = await db.transaction(async (tx) => {
      const [supplier] = await tx
        .insert(suppliersTable)
        .values(supplierData)
        .returning({ id: suppliersTable.id });

      if (!supplier) {
        tx.rollback();
        return;
      }

      const [address] = await tx
        .insert(addressesTable)
        .values({ ...addressData, supplierId: supplier.id })
        .returning({ id: addressesTable.id });

      if (!address) {
        tx.rollback();
        return;
      }

      const [contact] = await tx
        .insert(contactsTable)
        .values({ ...contactData, supplierId: supplier.id })
        .returning({ id: contactsTable.id });

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
        .returning({ id: suppliersTable.id });

      if (!updatedSupplier) {
        tx.rollback();
        return;
      }

      return updatedSupplier;
    });
    if (!supplier) throw new Error("Error inserting new supplier");
    return [supplier.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, `Supplier with name ${supplierData.name} already exists`];
    return [null, getErrorMessage(error)];
  }
};

export type SupplierListType = {
  id: number;
  name: string;
};

export const listAllSuppliers = async (): Promise<
  ReturnTuple<SupplierListType[]>
> => {
  try {
    const suppliers = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
      })
      .from(suppliersTable)
      .orderBy(asc(suppliersTable.name));

    if (!suppliers) return [null, "Error getting suppliers"];
    return [suppliers, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting suppliers"];
  }
};

export const getSuppliersCount = async (): Promise<ReturnTuple<number>> => {
  try {
    const [suppliers] = await db
      .select({ count: count() })
      .from(suppliersTable)
      .limit(1);

    if (!suppliers) return [null, "Error getting suppliers count"];
    return [suppliers.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

export const updateSupplier = async (
  supplierId: number,
  data: Partial<InsertSupplierType>,
): Promise<ReturnTuple<number>> => {
  try {
    const [returnValue] = await db
      .update(suppliersTable)
      .set(data)
      .where(eq(suppliersTable.id, supplierId))
      .returning({ id: suppliersTable.id });

    if (!returnValue) return [null, "Error updating supplier primary address"];
    return [returnValue.id, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
  }
};

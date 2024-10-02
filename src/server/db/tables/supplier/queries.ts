import { db } from "@/server/db";
import {
  type InsertSupplierType,
  type SelectSupplierType,
  suppliersTable,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { asc, count, eq } from "drizzle-orm";
import { getErrorMessage } from "@/lib/exceptions";

/**
 * Getters
 */

export type BriefSupplierType = Pick<
  SelectSupplierType,
  "id" | "name" | "registrationNumber"
>;

export const getAllSuppliersBrief = async (): Promise<
  ReturnTuple<BriefSupplierType[]>
> => {
  try {
    const allSuppliers = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
        registrationNumber: suppliersTable.registrationNumber,
      })
      .from(suppliersTable)
      .where(eq(suppliersTable.isActive, true))
      .orderBy(asc(suppliersTable.id));

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
  contacts: ContactDataType[];
  addresses: AddressDataType[];
  creator: UserDataType | null;
  updater: UserDataType | null;
}

export const getSupplierFullById = async (
  id: number,
): Promise<ReturnTuple<GetSupplierType>> => {
  try {
    const supplier = await db.query.suppliersTable.findFirst({
      where: (supplier, { eq }) => eq(supplier.id, id),
      with: {
        contacts: {
          columns: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
          },
        },
        addresses: {
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
  data: InsertSupplierType,
): Promise<ReturnTuple<number>> => {
  try {
    const [supplier] = await db
      .insert(suppliersTable)
      .values(data)
      .returning({ id: suppliersTable.id });

    if (!supplier) throw new Error("Error inserting new supplier");
    return [supplier.id, null];
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes("unique"))
      return [null, `Supplier with name ${data.name} already exists`];
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

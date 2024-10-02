import { db } from "@/server/db";
import {
  type InsertSupplierType,
  type SelectSupplierType,
  suppliersTable,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { asc, count, sql, desc } from "drizzle-orm";
import { getErrorMessage } from "@/lib/exceptions";
import { defaultPageLimit } from "@/data/config";
import { prepareSearchText } from "@/utils/common";

/**
 * Getters
 */

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
      .orderBy((table) =>
        searchText ? desc(table.rank) : desc(suppliersTable.id),
      )
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

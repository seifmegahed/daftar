import { db } from "@/server/db";
import { asc, count, sql, desc, eq } from "drizzle-orm";
import { suppliersTable } from "@/server/db/schema";

import { defaultPageLimit } from "@/data/config";
import { filterDefault } from "@/components/filter-and-search";
import { prepareSearchText, timestampQueryGenerator } from "@/utils/common";
import { errorLogger } from "@/lib/exceptions";

import type { SelectSupplierType } from "./schema";
import type { FilterArgs } from "@/components/filter-and-search";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Supplier Queries Error:",
  getPrimaryContactId: "An error occurred while getting primary contact",
  getPrimaryAddressId: "An error occurred while getting primary address",
  getSuppliers: "An error occurred while getting suppliers",
  getSupplier: "An error occurred while getting supplier",
  notFound: "Supplier not found",
  count: "An error occurred while counting suppliers",
};

const logError = errorLogger(errorMessages.mainTitle);

export const getSupplierPrimaryAddressId = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.getPrimaryAddressId;
  try {
    const [supplier] = await db
      .select({ primaryAddressId: suppliersTable.primaryAddressId })
      .from(suppliersTable)
      .where(eq(suppliersTable.id, supplierId))
      .limit(1);

    if (!supplier?.primaryAddressId) return [null, errorMessage];
    return [supplier.primaryAddressId, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierPrimaryContactId = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.getPrimaryContactId;
  try {
    const [supplier] = await db
      .select({ id: suppliersTable.primaryContactId })
      .from(suppliersTable)
      .where(eq(suppliersTable.id, supplierId))
      .limit(1);

    if (!supplier?.id) return [null, errorMessage];
    return [supplier.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const supplierFilterQuery = (filter: FilterArgs) => {
  switch (filter.filterType) {
    case "creationDate":
      return timestampQueryGenerator(
        suppliersTable.createdAt,
        filter.filterValue,
      );
    case "updateDate":
      return timestampQueryGenerator(
        suppliersTable.updatedAt,
        filter.filterValue,
      );
    default:
      return sql`true`;
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
  filter: FilterArgs = filterDefault,
  searchText?: string,
  limit = defaultPageLimit,
): Promise<ReturnTuple<BriefSupplierType[]>> => {
  const errorMessage = errorMessages.getSuppliers;
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
      .where(supplierFilterQuery(filter))
      .orderBy((table) => (searchText ? desc(table.rank) : desc(table.id)))
      .limit(limit)
      .offset((page - 1) * limit);

    return [allSuppliers, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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
  const errorMessage = errorMessages.getSupplier;
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
    if (!supplier) return [null, errorMessages.notFound];
    return [supplier, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export type SupplierListType = {
  id: number;
  name: string;
};

export const listAllSuppliers = async (): Promise<
  ReturnTuple<SupplierListType[]>
> => {
  const errorMessage = errorMessages.getSuppliers;
  try {
    const suppliers = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
      })
      .from(suppliersTable)
      .orderBy(asc(suppliersTable.name));
    return [suppliers, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSuppliersCount = async (
  filter: FilterArgs = filterDefault,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [suppliers] = await db
      .select({ count: count() })
      .from(suppliersTable)
      .where(supplierFilterQuery(filter))
      .limit(1);

    if (!suppliers) return [null, errorMessage];
    return [suppliers.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

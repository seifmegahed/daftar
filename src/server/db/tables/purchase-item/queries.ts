import { z } from "zod";
import { db } from "@/server/db";
import { count, desc, eq } from "drizzle-orm";
import {
  purchaseItemsTable,
  projectsTable,
  clientsTable,
  suppliersTable,
  itemsTable,
} from "@/server/db/schema";

import { selectSupplierSchema } from "@/server/db/tables/supplier/schema";
import { errorLogger } from "@/lib/exceptions";

import type { SelectPurchaseItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { performanceTimer } from "@/utils/performance";

const errorMessages = {
  mainTitle: "Purchase Items Queries Error:",
  corruptedData: "It seems that some data is corrupted",
  getItems: "An error occurred while getting items",
  getProjects: "An error occurred while getting projects",
  getSuppliers: "An error occurred while getting suppliers",
  count: "An error occurred while counting items",
  countProjects: "An error occurred while counting projects",
  countSuppliers: "An error occurred while counting suppliers",
};

const logError = errorLogger(errorMessages.mainTitle);

export type GetPurchaseItemType = SelectPurchaseItemType & {
  item: {
    id: number;
    name: string;
    make: string | null;
    mpn: string | null;
  };
  supplier: { id: number; name: string };
};

export const getPurchaseItems = async (
  projectId: number,
): Promise<ReturnTuple<GetPurchaseItemType[]>> => {
  const errorMessage = errorMessages.getItems;
  const timer = new performanceTimer("getPurchaseItems");
  try {
    timer.start();
    const projectItems = await db.query.purchaseItemsTable.findMany({
      where: (projectItem, { eq }) => eq(projectItem.projectId, projectId),
      with: {
        item: {
          columns: {
            id: true,
            name: true,
            make: true,
            mpn: true,
          },
        },
        supplier: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!projectItems) return [null, errorMessage];
    timer.end();

    return [projectItems, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getPurchaseItemsCount = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  const timer = new performanceTimer("getPurchaseItemsCount");
  try {
    timer.start();
    const [items] = await db
      .select({ count: count() })
      .from(purchaseItemsTable)
      .where(eq(purchaseItemsTable.projectId, projectId))
      .limit(1);
    timer.end();

    if (!items) return [null, errorMessage];
    return [items.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierItemsCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  const timer = new performanceTimer("getSupplierItemsCount");
  try {
    timer.start();
    const [items] = await db
      .select({ count: count() })
      .from(purchaseItemsTable)
      .where(eq(purchaseItemsTable.supplierId, supplierId))
      .limit(1);
    timer.end();

    if (!items) return [null, errorMessage];
    return [items.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const SupplierItemsSchema = z.object({
  itemId: z.number(),
  itemName: z.string(),
  itemMake: z.string(),
  quantity: z.number(),
  price: z.string(),
  projectId: z.number(),
  projectName: z.string(),
  createdAt: z.date(),
});

export type SupplierItemType = z.infer<typeof SupplierItemsSchema>;

export const getSupplierItems = async (
  supplierId: number,
): Promise<ReturnTuple<SupplierItemType[]>> => {
  const errorMessage = errorMessages.count;
  const timer = new performanceTimer("getSupplierItems");
  try {
    timer.start();
    const items = await db
      .select({
        itemId: itemsTable.id,
        itemName: itemsTable.name,
        itemMake: itemsTable.make,
        quantity: purchaseItemsTable.quantity,
        price: purchaseItemsTable.price,
        projectId: projectsTable.id,
        projectName: projectsTable.name,
        createdAt: projectsTable.createdAt,
      })
      .from(purchaseItemsTable)
      .where(eq(purchaseItemsTable.supplierId, supplierId))
      .leftJoin(
        projectsTable,
        eq(purchaseItemsTable.projectId, projectsTable.id),
      )
      .leftJoin(itemsTable, eq(purchaseItemsTable.itemId, itemsTable.id));
    timer.end();

    const parsedItems = z.array(SupplierItemsSchema).safeParse(items);

    if (parsedItems.error) return [null, errorMessages.corruptedData];
    return [parsedItems.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const supplierProjectsSchema = z.object({
  id: z.number(),
  name: z.string(),
  clientId: z.number(),
  clientName: z.string(),
  status: z.number(),
  createdAt: z.date(),
});

export type SupplierProjectsType = z.infer<typeof supplierProjectsSchema>;

export const getSupplierProjects = async (
  supplierId: number,
): Promise<ReturnTuple<SupplierProjectsType[]>> => {
  const errorMessage = errorMessages.getProjects;
  const timer = new performanceTimer("getSupplierProjects");
  try {
    timer.start();
    const projects = await db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        clientId: projectsTable.clientId,
        clientName: clientsTable.name,
        status: projectsTable.status,
        createdAt: projectsTable.createdAt,
      })
      .from(purchaseItemsTable)
      .where(eq(purchaseItemsTable.supplierId, supplierId))
      .leftJoin(
        projectsTable,
        eq(purchaseItemsTable.projectId, projectsTable.id),
      )
      .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
      .orderBy(desc(projectsTable.createdAt));
    timer.end();

    const parsedProjects = z.array(supplierProjectsSchema).safeParse(projects);

    if (parsedProjects.error) {
      logError(parsedProjects.error);
      return [null, errorMessages.corruptedData];
    }

    const uniqueProjects: SupplierProjectsType[] = [];

    parsedProjects.data.forEach((project) => {
      if (!uniqueProjects.find((_project) => _project.id === project.id)) {
        uniqueProjects.push(project);
      }
    });

    return [uniqueProjects, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierProjectsCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.countProjects;
  const timer = new performanceTimer("getSupplierProjectsCount");
  try {
    timer.start();
    const projects = await db
      .select({ projectId: purchaseItemsTable.projectId })
      .from(purchaseItemsTable)
      .where(eq(purchaseItemsTable.supplierId, supplierId));
    timer.end();

    if (!projects) return [null, errorMessage];

    const uniqueProjects = new Map<number, number>();

    projects.forEach((project) => {
      if (!uniqueProjects.has(project.projectId)) {
        uniqueProjects.set(project.projectId, project.projectId);
      }
    });

    return [uniqueProjects.size, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const ItemSuppliersSchema = selectSupplierSchema.pick({
  id: true,
  name: true,
  field: true,
  registrationNumber: true,
  createdAt: true,
});

export type ItemSupplierType = z.infer<typeof ItemSuppliersSchema>;

export const getItemSuppliers = async (
  itemId: number,
): Promise<ReturnTuple<ItemSupplierType[]>> => {
  const errorMessage = errorMessages.getSuppliers;
  const timer = new performanceTimer("getItemSuppliers");
  try {
    timer.start();
    const suppliers = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
        field: suppliersTable.field,
        registrationNumber: suppliersTable.registrationNumber,
        createdAt: suppliersTable.createdAt,
      })
      .from(purchaseItemsTable)
      .where(eq(purchaseItemsTable.itemId, itemId))
      .leftJoin(
        suppliersTable,
        eq(purchaseItemsTable.supplierId, suppliersTable.id),
      )
      .orderBy(desc(suppliersTable.createdAt));
    timer.end();

    const parsedSuppliers = z.array(ItemSuppliersSchema).safeParse(suppliers);

    if (parsedSuppliers.error) {
      logError(parsedSuppliers.error);
      return [null, errorMessages.corruptedData];
    }

    const uniqueSuppliers: ItemSupplierType[] = [];

    parsedSuppliers.data.forEach((supplier) => {
      if (!uniqueSuppliers.find((_supplier) => _supplier.id === supplier.id)) {
        uniqueSuppliers.push(supplier);
      }
    });

    return [uniqueSuppliers, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getItemSuppliersCount = async (
  itemId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.countSuppliers;
  const timer = new performanceTimer("getItemSuppliersCount");
  try {
    timer.start();
    const suppliers = await db
      .select({ supplierId: purchaseItemsTable.supplierId })
      .from(purchaseItemsTable)
      .where(eq(purchaseItemsTable.itemId, itemId));
    timer.end();

    if (!suppliers) return [null, errorMessage];

    const uniqueSuppliers = new Map<number, number>();

    suppliers.forEach((supplier) => {
      if (!uniqueSuppliers.has(supplier.supplierId)) {
        uniqueSuppliers.set(supplier.supplierId, supplier.supplierId);
      }
    });

    return [uniqueSuppliers.size, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

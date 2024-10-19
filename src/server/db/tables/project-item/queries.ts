import { z } from "zod";
import { db } from "@/server/db";
import { count, desc, eq } from "drizzle-orm";
import {
  projectItemsTable,
  projectsTable,
  clientsTable,
  suppliersTable,
  itemsTable,
} from "@/server/db/schema";

import { selectSupplierSchema } from "@/server/db/tables/supplier/schema";
import { errorLogger } from "@/lib/exceptions";

import type { InsertProjectItemType, SelectProjectItemType } from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Project Items Queries Error:",
  insert: "An error occurred while adding sale item",
  corruptedData: "It seems that some data is corrupted",
  getItems: "An error occurred while getting items",
  getProjects: "An error occurred while getting projects",
  getSuppliers: "An error occurred while getting suppliers",
  count: "An error occurred while counting items",
  delete: "An error occurred while deleting purchase item",
};

const logError = errorLogger(errorMessages.mainTitle);

export const getClientProjectsCount = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [projectCount] = await db
      .select({
        count: count(),
      })
      .from(projectsTable)
      .where(eq(projectsTable.clientId, clientId))
      .limit(1);
    if (!projectCount) return [null, errorMessage];

    return [projectCount.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const insertProjectItem = async (
  data: InsertProjectItemType,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.insert;
  try {
    const [project] = await db
      .insert(projectItemsTable)
      .values(data)
      .returning();

    if (!project) return [null, errorMessage];
    return [project.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export type GetProjectItemType = SelectProjectItemType & {
  item: {
    id: number;
    name: string;
    make: string | null;
    mpn: string | null;
  };
  supplier: { id: number; name: string };
};

export const getProjectItems = async (
  projectId: number,
): Promise<ReturnTuple<GetProjectItemType[]>> => {
  const errorMessage = errorMessages.getItems;
  try {
    const projectItems = await db.query.projectItemsTable.findMany({
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

    return [projectItems, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const deleteProjectItem = async (
  projectItemId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.delete;
  try {
    const [projectItem] = await db
      .delete(projectItemsTable)
      .where(eq(projectItemsTable.id, projectItemId))
      .returning();

    if (!projectItem) return [null, errorMessage];
    return [projectItem.id, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierItemsCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [items] = await db
      .select({ count: count() })
      .from(projectItemsTable)
      .where(eq(projectItemsTable.supplierId, supplierId))
      .limit(1);

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
  try {
    const items = await db
      .select({
        itemId: itemsTable.id,
        itemName: itemsTable.name,
        itemMake: itemsTable.make,
        quantity: projectItemsTable.quantity,
        price: projectItemsTable.price,
        projectId: projectsTable.id,
        projectName: projectsTable.name,
        createdAt: projectsTable.createdAt,
      })
      .from(projectItemsTable)
      .where(eq(projectItemsTable.supplierId, supplierId))
      .leftJoin(
        projectsTable,
        eq(projectItemsTable.projectId, projectsTable.id),
      )
      .leftJoin(itemsTable, eq(projectItemsTable.itemId, itemsTable.id));

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
  try {
    const projects = await db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        clientId: projectsTable.clientId,
        clientName: clientsTable.name,
        status: projectsTable.status,
        createdAt: projectsTable.createdAt,
      })
      .from(projectItemsTable)
      .where(eq(projectItemsTable.supplierId, supplierId))
      .leftJoin(
        projectsTable,
        eq(projectItemsTable.projectId, projectsTable.id),
      )
      .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
      .orderBy(desc(projectsTable.createdAt));

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

const itemProjectsSchema = z.object({
  id: z.number(),
  name: z.string(),
  clientId: z.number(),
  clientName: z.string(),
  status: z.number(),
  createdAt: z.date(),
});

export type ItemProjectsType = z.infer<typeof itemProjectsSchema>;

export const getItemProjects = async (
  itemId: number,
): Promise<ReturnTuple<ItemProjectsType[]>> => {
  const errorMessage = errorMessages.getProjects;
  try {
    const projectItems = await db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        clientId: projectsTable.clientId,
        clientName: clientsTable.name,
        status: projectsTable.status,
        createdAt: projectsTable.createdAt,
      })
      .from(projectItemsTable)
      .where(eq(projectItemsTable.itemId, itemId))
      .leftJoin(
        projectsTable,
        eq(projectItemsTable.projectId, projectsTable.id),
      )
      .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
      .orderBy(desc(projectsTable.createdAt));

    const parsedProjects = z.array(itemProjectsSchema).safeParse(projectItems);

    if (parsedProjects.error) {
      logError(parsedProjects.error);
      return [null, errorMessages.corruptedData];
    }

    const uniqueProjects: ItemProjectsType[] = [];

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
  try {
    const suppliers = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
        field: suppliersTable.field,
        registrationNumber: suppliersTable.registrationNumber,
        createdAt: suppliersTable.createdAt,
      })
      .from(projectItemsTable)
      .where(eq(projectItemsTable.itemId, itemId))
      .leftJoin(
        suppliersTable,
        eq(projectItemsTable.supplierId, suppliersTable.id),
      )
      .orderBy(desc(suppliersTable.createdAt));

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

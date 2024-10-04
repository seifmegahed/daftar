import { z } from "zod";
import { count, desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { projectItemsTable } from "./schema";

import { projectsTable } from "@/server/db/tables/project/schema";
import { clientsTable } from "@/server/db/tables/client/schema";
import { itemsTable } from "@/server/db/tables/item/schema";

import { getErrorMessage } from "@/lib/exceptions";

import type {
  InsertProjectItemType,
  SelectProjectItemType,
} from "@/server/db/tables/project-item/schema";
import type { ReturnTuple } from "@/utils/type-utils";

export const getClientProjectsCount = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [projectCount] = await db
      .select({
        count: count(),
      })
      .from(projectsTable)
      .where(eq(projectsTable.clientId, clientId))
      .limit(1);
    if (!projectCount) return [null, "Error getting project count"];
    return [projectCount.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project count"];
  }
};

export const insertProjectItem = async (
  data: InsertProjectItemType,
): Promise<ReturnTuple<number>> => {
  try {
    const [project] = await db
      .insert(projectItemsTable)
      .values(data)
      .returning({ id: projectItemsTable.id });

    if (!project) return [null, "Error inserting project item"];
    return [project.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error inserting project item"];
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
    if (!projectItems) return [null, "Error getting project items"];

    return [projectItems, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project items"];
  }
};

export const deleteProjectItem = async (
  projectItemId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [projectItem] = await db
      .delete(projectItemsTable)
      .where(eq(projectItemsTable.id, projectItemId))
      .returning({ id: projectItemsTable.id });

    if (!projectItem) return [null, "Error deleting project item"];
    return [projectItem.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error deleting project item"];
  }
};

export const getSupplierItemsCount = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [items] = await db
      .select({ count: count() })
      .from(projectItemsTable)
      .where(eq(projectItemsTable.supplierId, supplierId))
      .limit(1);

    if (!items) return [null, "Error getting items count"];
    return [items.count, null];
  } catch (error) {
    return [null, getErrorMessage(error)];
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

    if (parsedItems.error) return [null, "Error getting supplier items"];

    return [parsedItems.data, null];
  } catch (error) {
    console.log(error);
    return [null, getErrorMessage(error)];
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

    if (parsedProjects.error) return [null, "Error getting supplier projects"];

    const uniqueProjects: SupplierProjectsType[] = [];

    parsedProjects.data.forEach((project) => {
      if (!uniqueProjects.find((_project) => _project.id === project.id)) {
        uniqueProjects.push(project);
      }
    });

    return [uniqueProjects, null];
  } catch (error) {
    console.log(error);
    return [null, getErrorMessage(error)];
  }
};

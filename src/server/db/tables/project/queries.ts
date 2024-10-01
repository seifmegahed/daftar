import { db } from "@/server/db";
import {
  projectItemsTable,
  projectsTable,
  type SelectProjectItemType,
  type InsertProjectItemType,
  type InsertProjectType,
  type SelectProjectType,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import type { UserBriefType } from "../user/queries";
import type { SimpDoc } from "../document/queries";
import { count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { clientsTable } from "../client/schema";
import { usersTable } from "../user/schema";

export type BriefProjectType = Pick<
  SelectProjectType,
  "id" | "name" | "status" | "createdAt"
> & {
  clientId: number;
  clientName: string;
  ownerId: number;
  ownerName: string;
};

export const getProjectsCount = async (): Promise<ReturnTuple<number>> => {
  try {
    const [projectCount] = await db
      .select({
        count: count(),
      })
      .from(projectsTable)
      .limit(1);
    if (!projectCount) return [null, "Error getting project count"];
    return [projectCount.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project count"];
  }
};

const briefProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  status: z.number(),

  createdAt: z.date(),

  clientId: z.number(),
  clientName: z.string(),

  ownerId: z.number(),
  ownerName: z.string(),
});

const prepareSearchText = (searchText: string) => {
  searchText = searchText.trim().replace(/\s+/g, " ").toLowerCase();
  if (!searchText) return "";
  const searchTextArray = searchText.split(" ");
  searchTextArray[searchTextArray.length - 1] += ":*";
  return searchTextArray.join(" | ");
};

const projectSearchQuery = (searchText: string) =>
  sql`
    (
      setweight(to_tsvector('english', ${projectsTable.name}), 'A') ||
      setweight(to_tsvector('english', coalesce(${projectsTable.description}, '')), 'B') 
    ) || (
      to_tsvector('english', ${clientsTable.name}) 
    ), to_tsquery(${prepareSearchText(searchText)})
  `;

export const getProjectsBrief = async (
  page: number,
  searchText?: string,
  limit = 10,
): Promise<ReturnTuple<BriefProjectType[]>> => {
  try {
    const projectsResult = await db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        description: projectsTable.description,
        status: projectsTable.status,
        createdAt: projectsTable.createdAt,
        clientId: projectsTable.clientId,
        clientName: clientsTable.name,
        ownerId: projectsTable.ownerId,
        ownerName: usersTable.name,
        rank: searchText
          ? sql`ts_rank(${projectSearchQuery(searchText ?? "")})`
          : sql`1`,
      })
      .from(projectsTable)
      .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
      .leftJoin(usersTable, eq(projectsTable.ownerId, usersTable.id))
      .orderBy((table) => (searchText ? desc(table.rank) : desc(table.id)))
      .limit(limit)
      .offset((page - 1) * limit);

    const projects = z.array(briefProjectSchema).safeParse(projectsResult);

    if (!projects.success) return [null, "Error getting projects"];

    return [projects.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting projects"];
  }
};

export const insertProject = async (
  data: InsertProjectType,
): Promise<ReturnTuple<number>> => {
  try {
    const [project] = await db
      .insert(projectsTable)
      .values(data)
      .returning({ id: projectsTable.id });

    if (!project) return [null, "Error inserting new project"];
    return [project.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error inserting new project"];
  }
};

export const getProjectBriefById = async (
  id: number,
): Promise<ReturnTuple<SelectProjectType>> => {
  try {
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, id));

    if (!project) return [null, "Error getting project"];

    return [project, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project"];
  }
};

export type ProjectClientType = {
  id: number;
  name: string;
  registrationNumber: string | null;
  website: string | null;
  primaryAddress: {
    id: number;
    addressLine: string;
    city: string | null;
    country: string;
  } | null;
  primaryContact: {
    id: number;
    name: string;
    email: string | null;
    phoneNumber: string | null;
  } | null;
};

type ProjectItemType = {
  id: number;
  quantity: number;
  price: string;
  currency: number;
  item: { id: number; name: string; make: string | null; mpn: string | null };
  supplier: { id: number; name: string };
};

export type GetProjectType = SelectProjectType & {
  client: ProjectClientType;
  items: ProjectItemType[];
  owner: UserBriefType;
  creator: UserBriefType;
  updater: UserBriefType | null;
};

export const getProjectById = async (
  id: number,
): Promise<ReturnTuple<GetProjectType>> => {
  try {
    const project = await db.query.projectsTable.findFirst({
      where: (project, { eq }) => eq(project.id, id),
      with: {
        client: {
          columns: {
            id: true,
            name: true,
            registrationNumber: true,
            website: true,
          },
          with: {
            primaryAddress: {
              columns: {
                id: true,
                addressLine: true,
                city: true,
                country: true,
              },
            },
            primaryContact: {
              columns: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        owner: {
          columns: {
            id: true,
            name: true,
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
        items: {
          columns: {
            id: true,
            quantity: true,
            price: true,
            currency: true,
          },
          with: {
            supplier: {
              columns: {
                id: true,
                name: true,
              },
            },
            item: {
              columns: {
                id: true,
                name: true,
                make: true,
                mpn: true,
              },
            },
          },
        },
      },
    });
    if (!project) return [null, "Error getting project"];
    return [project, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project"];
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

export type GetProjectLinkedDocumentsType = {
  projectDocuments: SimpDoc[];
  clientDocuments: SimpDoc[];
  itemsDocuments: SimpDoc[];
  suppliersDocuments: SimpDoc[];
};

export const getProjectLinkedDocuments = async (
  projectId: number,
  includePath = false,
): Promise<ReturnTuple<GetProjectLinkedDocumentsType>> => {
  try {
    const project = await db.query.projectsTable.findFirst({
      where: (project, { eq }) => eq(project.id, projectId),
      columns: {},
      with: {
        client: {
          columns: {},
          with: {
            documents: {
              columns: {},
              with: {
                document: {
                  columns: {
                    id: true,
                    name: true,
                    extension: true,
                    path: includePath,
                  },
                },
              },
            },
          },
        },
        items: {
          columns: {},
          with: {
            supplier: {
              columns: { id: true },
              with: {
                documents: {
                  columns: {},
                  with: {
                    document: {
                      columns: {
                        id: true,
                        name: true,
                        extension: true,
                        path: includePath,
                      },
                    },
                  },
                },
              },
            },
            item: {
              columns: { id: true },
              with: {
                documents: {
                  columns: {},
                  with: {
                    document: {
                      columns: {
                        id: true,
                        name: true,
                        extension: true,
                        path: includePath,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        documents: {
          columns: {},
          with: {
            document: {
              columns: {
                id: true,
                name: true,
                extension: true,
                path: includePath,
              },
            },
          },
        },
      },
    });

    if (!project) return [null, "Error getting project"];

    const uniqueSuppliers = new Map<number, (typeof project.items)[0]>();
    const uniqueItems = new Map<number, (typeof project.items)[0]>();

    project.items.forEach((item) => {
      if (!uniqueSuppliers.has(item.supplier.id)) {
        uniqueSuppliers.set(item.supplier.id, item);
      }
      if (!uniqueItems.has(item.item.id)) {
        uniqueItems.set(item.item.id, item);
      }
    });

    const suppliersDocuments = Array.from(uniqueSuppliers.values()).flatMap(
      (item) => item.supplier.documents.map((doc) => doc.document),
    );
    const itemsDocuments = Array.from(uniqueItems.values()).flatMap((item) =>
      item.item.documents.map((doc) => doc.document),
    );

    return [
      {
        projectDocuments: project.documents.map((x) => x.document),
        clientDocuments: project.client.documents.map((x) => x.document),
        itemsDocuments,
        suppliersDocuments,
      },
      null,
    ];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project"];
  }
};

export const updateProject = async (
  id: number,
  data: Partial<SelectProjectType>,
): Promise<ReturnTuple<number>> => {
  try {
    const [project] = await db
      .update(projectsTable)
      .set(data)
      .where(eq(projectsTable.id, id))
      .returning({ id: projectsTable.id });

    if (!project) return [null, "Error updating project"];
    return [project.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error updating project"];
  }
};

export const deleteProject = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [project] = await db
      .delete(projectsTable)
      .where(eq(projectsTable.id, id))
      .returning({ id: projectsTable.id });

    if (!project) return [null, "Error deleting project"];
    return [project.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error deleting project"];
  }
};

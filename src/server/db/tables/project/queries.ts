import { z } from "zod";
import { db } from "@/server/db";
import { count, desc, eq, sql } from "drizzle-orm";
import { projectsTable, clientsTable, usersTable } from "@/server/db/schema";

import {
  dateQueryGenerator,
  prepareSearchText,
  timestampQueryGenerator,
} from "@/utils/common";
import { errorLogger } from "@/lib/exceptions";
import { defaultPageLimit } from "@/data/config";
import { filterDefault } from "@/components/filter-and-search";

import type { SelectProjectType } from "./schema";
import type { UserBriefType } from "@/server/db/tables/user/queries";
import type { SimpDoc } from "@/server/db/tables/document/queries";
import type { FilterArgs } from "@/components/filter-and-search";
import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Project Queries Error:",
  getProject: "An error occurred while getting project",
  count: "An error occurred while counting projects",
  getProjects: "An error occurred while getting projects",
  getDocuments: "An error occurred while getting project documents",
  dataCorrupted: "It seems that some data is corrupted",
};

const logError = errorLogger(errorMessages.mainTitle);

export type BriefProjectType = Pick<
  SelectProjectType,
  "id" | "name" | "status" | "createdAt"
> & {
  clientId: number;
  clientName: string;
  ownerId: number;
  ownerName: string;
};

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

const projectSearchQuery = (searchText: string) =>
  sql`
    (
      setweight(to_tsvector('english', ${projectsTable.name}), 'A') ||
      setweight(to_tsvector('english', coalesce(${projectsTable.description}, '')), 'B') 
    ) || (
      to_tsvector('english', ${clientsTable.name}) 
    ), to_tsquery(${prepareSearchText(searchText)})
  `;

const projectFilterQuery = (filter: FilterArgs) => {
  switch (filter.filterType) {
    case "status":
      return sql`status = ${filter.filterValue}`;
    case "startDate":
      return dateQueryGenerator(projectsTable.startDate, filter.filterValue);
    case "endDate":
      return dateQueryGenerator(projectsTable.startDate, filter.filterValue);
    case "creationDate":
      return timestampQueryGenerator(
        projectsTable.createdAt,
        filter.filterValue,
      );
    case "updateDate":
      return timestampQueryGenerator(
        projectsTable.updatedAt,
        filter.filterValue,
      );
    default:
      return sql`true`;
  }
};

export const getProjectsCount = async (
  filter: FilterArgs = filterDefault,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [projectCount] = await db
      .select({
        count: count(),
      })
      .from(projectsTable)
      .where(
        projectFilterQuery(filter ?? { filterType: null, filterValue: null }),
      )
      .limit(1);

    if (!projectCount) return [null, errorMessage];

    return [projectCount.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getProjectsBrief = async (
  page: number,
  filter: FilterArgs = filterDefault,
  searchText?: string,
  limit = defaultPageLimit,
): Promise<ReturnTuple<BriefProjectType[]>> => {
  const errorMessage = errorMessages.getProjects;
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
      .where(projectFilterQuery(filter))
      .orderBy((table) => (searchText ? desc(table.rank) : desc(table.id)))
      .limit(limit)
      .offset((page - 1) * limit);

    const projects = z.array(briefProjectSchema).safeParse(projectsResult);

    if (!projects.success) return [null, errorMessages.dataCorrupted];

    return [projects.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const briefClientProjectSchema = briefProjectSchema.omit({
  ownerId: true,
  ownerName: true,
  description: true,
});

export type BriefClientProjectType = z.infer<typeof briefClientProjectSchema>;

export const getClientProjects = async (
  clientId: number,
): Promise<ReturnTuple<BriefClientProjectType[]>> => {
  const errorMessage = errorMessages.getProjects;
  try {
    const projectsResult = await db
      .select({
        id: projectsTable.id,
        name: projectsTable.name,
        status: projectsTable.status,
        clientId: projectsTable.clientId,
        clientName: clientsTable.name,
        createdAt: projectsTable.createdAt,
      })
      .from(projectsTable)
      .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
      .where(eq(projectsTable.clientId, clientId))
      .orderBy(desc(projectsTable.id));

    const projects = z
      .array(briefClientProjectSchema)
      .safeParse(projectsResult);

    if (!projects.success) return [null, errorMessage];

    return [projects.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getProjectBriefById = async (
  id: number,
): Promise<ReturnTuple<SelectProjectType>> => {
  const errorMessage = errorMessages.getProject;
  try {
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, id));

    if (!project) return [null, errorMessage];

    return [project, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
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

export type GetProjectType = SelectProjectType & {
  client: ProjectClientType;
  owner: UserBriefType;
  creator: UserBriefType;
  updater: UserBriefType | null;
};

export const getProjectById = async (
  id: number,
): Promise<ReturnTuple<GetProjectType>> => {
  const errorMessage = errorMessages.getProject;
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
      },
    });
    if (!project) return [null, errorMessage];
    return [project, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const documentPrivateFilter = (access: boolean) => (document: SimpDoc) =>
  access ? true : !document.private;

export type GetProjectLinkedDocumentsType = {
  projectDocuments: SimpDoc[];
  clientDocuments: SimpDoc[];
  itemsDocuments: SimpDoc[];
  suppliersDocuments: SimpDoc[];
};

export const getProjectLinkedDocuments = async (
  projectId: number,
  accessToPrivate = false,
  includePath = false,
): Promise<ReturnTuple<GetProjectLinkedDocumentsType>> => {
  const errorMessage = errorMessages.getDocuments;
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
                    private: true,
                  },
                },
              },
            },
          },
        },
        purchaseItems: {
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
                        private: true,
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
                        private: true,
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
                private: true,
              },
            },
          },
        },
        saleItems: {
          columns: {},
          with: {
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
                        private: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) return [null, errorMessage];

    const uniqueSuppliers = new Map<
      number,
      (typeof project.purchaseItems)[0]
    >();
    const uniqueItems = new Map<number, (typeof project.saleItems)[0]>();

    project.purchaseItems.forEach((item) => {
      if (!uniqueSuppliers.has(item.supplier.id)) {
        uniqueSuppliers.set(item.supplier.id, item);
      }
      if (!uniqueItems.has(item.item.id)) {
        uniqueItems.set(item.item.id, item);
      }
    });

    project.saleItems.forEach((item) => {
      if (!uniqueItems.has(item.item.id)) {
        uniqueItems.set(item.item.id, item);
      }
    });

    const suppliersDocuments = Array.from(uniqueSuppliers.values())
      .flatMap((item) => item.supplier.documents.map((doc) => doc.document))
      .filter(documentPrivateFilter(accessToPrivate));
    const itemsDocuments = Array.from(uniqueItems.values())
      .flatMap((item) => item.item.documents.map((doc) => doc.document))
      .filter(documentPrivateFilter(accessToPrivate));

    return [
      {
        projectDocuments: project.documents
          .map((x) => x.document)
          .filter(documentPrivateFilter(accessToPrivate)),
        clientDocuments: project.client.documents
          .map((x) => x.document)
          .filter(documentPrivateFilter(accessToPrivate)),
        itemsDocuments,
        suppliersDocuments,
      },
      null,
    ];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

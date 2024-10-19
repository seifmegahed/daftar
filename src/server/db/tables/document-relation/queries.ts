import { z } from "zod";
import { db } from "@/server/db";
import { count, eq, and, desc, isNotNull } from "drizzle-orm";

import { documentRelationsTable } from "./schema";
import {
  clientsTable,
  documentsTable,
  itemsTable,
  projectsTable,
  suppliersTable,
} from "@/server/db/schema";

import { privateFilterQuery } from "@/server/db/tables/document/utils";
import { errorLogger } from "@/lib/exceptions";

import type { ReturnTuple } from "@/utils/type-utils";

const errorMessages = {
  mainTitle: "Document Relations Queries Error:",
  getDocument: "An error occurred while getting document",
  getDocuments: "An error occurred while getting documents",
  getPath: "An error occurred while getting document path",
  count: "An error occurred while counting documents",
  dataCorrupted: "It seems that some data is corrupted",
  getProjects: "An error occurred while getting projects",
  countProjects: "An error occurred while counting projects",
  getItems: "An error occurred while getting items",
  countItems: "An error occurred while counting items",
  getClients: "An error occurred while getting clients",
  countClients: "An error occurred while counting clients",
  getSuppliers: "An error occurred while getting suppliers",
  countSuppliers: "An error occurred while counting suppliers",
};

const logError = errorLogger(errorMessages.mainTitle);

const simpDocWithRelationSchema = z.object({
  relationId: z.number(),
  id: z.number(),
  name: z.string(),
  extension: z.string(),
  private: z.boolean(),
});

export type SimpDocWithRelation = z.infer<typeof simpDocWithRelationSchema>;

export const getClientDocuments = async (
  clientId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  const errorMessage = errorMessages.getDocuments;
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
        private: documentsTable.private,
      })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        eq(documentRelationsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(documentRelationsTable.clientId, clientId),
          privateFilterQuery(accessToPrivate),
        ),
      );

    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, errorMessages.dataCorrupted];

    return [result.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierDocuments = async (
  supplierId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  const errorMessage = errorMessages.getDocuments;
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
        private: documentsTable.private,
      })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        eq(documentRelationsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(documentRelationsTable.supplierId, supplierId),
          privateFilterQuery(accessToPrivate),
        ),
      );

    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, errorMessages.dataCorrupted];

    return [result.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getItemDocuments = async (
  itemId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  const errorMessage = errorMessages.getDocuments;
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
        private: documentsTable.private,
      })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .where(
        and(
          eq(documentRelationsTable.itemId, itemId),
          privateFilterQuery(accessToPrivate),
        ),
      );

    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, errorMessages.dataCorrupted];

    return [result.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getProjectDocuments = async (
  projectId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  const errorMessage = errorMessages.getDocuments;
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
        private: documentsTable.private,
      })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        eq(documentRelationsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(documentRelationsTable.projectId, projectId),
          privateFilterQuery(accessToPrivate),
        ),
      );

    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, errorMessages.dataCorrupted];

    return [result.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getClientDocumentsCount = async (
  clientId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        eq(documentRelationsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(documentRelationsTable.clientId, clientId),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, errorMessage];
    return [documents.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getSupplierDocumentsCount = async (
  supplierId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        eq(documentRelationsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(documentRelationsTable.supplierId, supplierId),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, errorMessage];
    return [documents.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getItemDocumentsCount = async (
  itemId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        eq(documentRelationsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(documentRelationsTable.itemId, itemId),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, errorMessage];
    return [documents.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getProjectDocumentsCount = async (
  projectId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .leftJoin(
        documentsTable,
        eq(documentRelationsTable.documentId, documentsTable.id),
      )
      .where(
        and(
          eq(documentRelationsTable.projectId, projectId),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, errorMessage];
    return [documents.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const getDocumentRelationsCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.count;
  try {
    const [result] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.documentId, id))
      .limit(1);

    if (!result) return [null, errorMessage];
    return [result.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const documentProjectsSchema = z.object({
  id: z.number(),
  name: z.string(),
  clientId: z.number(),
  clientName: z.string(),
  status: z.number(),
  createdAt: z.date(),
});

export type DocumentProjectsType = z.infer<typeof documentProjectsSchema>;

export const getDocumentProjects = async (
  id: number,
): Promise<ReturnTuple<DocumentProjectsType[]>> => {
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
      .from(documentRelationsTable)
      .leftJoin(
        projectsTable,
        eq(documentRelationsTable.projectId, projectsTable.id),
      )
      .leftJoin(clientsTable, eq(projectsTable.clientId, clientsTable.id))
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(projectsTable.id),
        ),
      )
      .orderBy(desc(projectsTable.createdAt));

    const parsedProjects = z.array(documentProjectsSchema).safeParse(projects);
    if (parsedProjects.error) return [null, errorMessages.dataCorrupted];

    return [parsedProjects.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const documentProjectsCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.countProjects;
  try {
    const [projects] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(documentRelationsTable.projectId),
        ),
      )
      .limit(1);

    if (!projects) return [null, errorMessage];
    return [projects.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const documentClientsSchema = z.object({
  id: z.number(),
  name: z.string(),
  registrationNumber: z.string().nullable(),
  createdAt: z.date(),
});

export type DocumentClientsType = z.infer<typeof documentClientsSchema>;

export const getDocumentClients = async (
  id: number,
): Promise<ReturnTuple<DocumentClientsType[]>> => {
  const errorMessage = errorMessages.getClients;
  try {
    const clients = await db
      .select({
        id: clientsTable.id,
        name: clientsTable.name,
        registrationNumber: clientsTable.registrationNumber,
        createdAt: clientsTable.createdAt,
      })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(documentRelationsTable.clientId),
        ),
      )
      .leftJoin(
        clientsTable,
        eq(documentRelationsTable.clientId, clientsTable.id),
      )
      .orderBy(desc(clientsTable.createdAt));

    const parsedClients = z.array(documentClientsSchema).safeParse(clients);
    if (parsedClients.error) return [null, errorMessages.dataCorrupted];

    return [parsedClients.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const documentClientsCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.countClients;
  try {
    const [clients] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(documentRelationsTable.clientId),
        ),
      )
      .limit(1);

    if (!clients) return [null, errorMessage];
    return [clients.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const documentSuppliersSchema = z.object({
  id: z.number(),
  name: z.string(),
  field: z.string(),
  registrationNumber: z.string().nullable(),
  createdAt: z.date(),
});

export type DocumentSuppliersType = z.infer<typeof documentSuppliersSchema>;

export const getDocumentSuppliers = async (
  id: number,
): Promise<ReturnTuple<DocumentSuppliersType[]>> => {
  const errorMessage = errorMessages.countSuppliers;
  try {
    const suppliers = await db
      .select({
        id: suppliersTable.id,
        name: suppliersTable.name,
        field: suppliersTable.field,
        registrationNumber: suppliersTable.registrationNumber,
        createdAt: suppliersTable.createdAt,
      })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(documentRelationsTable.supplierId),
        ),
      )
      .leftJoin(
        suppliersTable,
        eq(documentRelationsTable.supplierId, suppliersTable.id),
      )
      .orderBy(desc(suppliersTable.createdAt));

    const parsedSuppliers = z
      .array(documentSuppliersSchema)
      .safeParse(suppliers);
    if (parsedSuppliers.error) return [null, errorMessages.dataCorrupted];

    return [parsedSuppliers.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const documentSuppliersCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.countSuppliers;
  try {
    const [suppliers] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(documentRelationsTable.supplierId),
        ),
      )
      .limit(1);

    if (!suppliers) return [null, errorMessage];
    return [suppliers.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

const documentItemsSchema = z.object({
  id: z.number(),
  name: z.string(),
  make: z.string(),
  mpn: z.string(),
  type: z.string(),
  createdAt: z.date(),
});

export type DocumentItemsType = z.infer<typeof documentItemsSchema>;

export const getDocumentItems = async (
  id: number,
): Promise<ReturnTuple<DocumentItemsType[]>> => {
  const errorMessage = errorMessages.getItems;
  try {
    const items = await db
      .select({
        id: itemsTable.id,
        name: itemsTable.name,
        make: itemsTable.make,
        mpn: itemsTable.mpn,
        type: itemsTable.type,
        createdAt: itemsTable.createdAt,
      })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(documentRelationsTable.itemId),
        ),
      )
      .leftJoin(itemsTable, eq(documentRelationsTable.itemId, itemsTable.id))
      .orderBy(desc(itemsTable.createdAt));

    const parsedItems = z.array(documentItemsSchema).safeParse(items);
    if (parsedItems.error) return [null, errorMessages.dataCorrupted];

    return [parsedItems.data, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

export const documentItemsCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const errorMessage = errorMessages.countItems;
  try {
    const [items] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          isNotNull(documentRelationsTable.itemId),
        ),
      )
      .limit(1);

    if (!items) return [null, errorMessage];
    return [items.count, null];
  } catch (error) {
    logError(error);
    return [null, errorMessage];
  }
};

import { count, eq, and, desc, isNotNull } from "drizzle-orm";
import { db } from "@/server/db";

import { documentRelationsTable } from "./schema";
import {
  clientsTable,
  documentsTable,
  itemsTable,
  projectsTable,
  suppliersTable,
} from "@/server/db/schema";

import type { DocumentRelationsType } from "./schema";
import type { DocumentDataType } from "@/server/db/tables/document/schema";
import { privateFilterQuery } from "@/server/db/tables/document/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { z } from "zod";

export const insertDocumentRelation = async (
  relation: DocumentRelationsType,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .insert(documentRelationsTable)
      .values(relation)
      .returning({ id: documentRelationsTable.id });

    if (!result) return [null, "Error inserting document relation"];
    return [result.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error inserting document relation"];
  }
};

export const insertDocumentWithRelation = async (
  document: DocumentDataType,
  relation: Omit<DocumentRelationsType, "documentId">,
): Promise<ReturnTuple<number>> => {
  try {
    const documentId = await db.transaction(async (tx) => {
      const [documentResult] = await tx
        .insert(documentsTable)
        .values(document)
        .returning({ id: documentsTable.id });
      if (!documentResult) return undefined;
      await tx
        .insert(documentRelationsTable)
        .values({ ...relation, documentId: documentResult.id })
        .returning({ id: documentRelationsTable.id });

      return documentResult.id;
    });

    if (!documentId) return [null, "Error inserting document"];
    return [documentId, null];
  } catch (error) {
    console.log(error);
    return [null, "Error inserting document"];
  }
};

const simpDocWithRelationSchema = z.object({
  relationId: z.number(),
  id: z.number(),
  name: z.string(),
  extension: z.string(),
});

export type SimpDocWithRelation = z.infer<typeof simpDocWithRelationSchema>;

export const getClientDocuments = async (
  clientId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
      })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.clientId, clientId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      );
    if (!documents) return [null, "Error getting client documents"];
    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, "Error getting client documents"];
    return [result.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting client documents"];
  }
};

export const getSupplierDocuments = async (
  supplierId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
      })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.supplierId, supplierId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      );
    if (!documents) return [null, "Error getting supplier documents"];
    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, "Error getting supplier documents"];
    return [result.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting supplier documents"];
  }
};

export const getItemDocuments = async (
  itemId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
      })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.itemId, itemId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      );
    if (!documents) return [null, "Error getting item documents"];
    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, "Error getting item documents"];
    return [result.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting item documents"];
  }
};

export const getProjectDocuments = async (
  projectId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<SimpDocWithRelation[]>> => {
  try {
    const documents = await db
      .select({
        relationId: documentRelationsTable.id,
        id: documentsTable.id,
        name: documentsTable.name,
        extension: documentsTable.extension,
      })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.projectId, projectId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      );
    if (!documents) return [null, "Error getting project documents"];
    const result = z.array(simpDocWithRelationSchema).safeParse(documents);
    if (result.error) return [null, "Error getting project documents"];
    return [result.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project documents"];
  }
};

export const getClientDocumentsCount = async (
  clientId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.clientId, clientId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, "Error getting client documents count"];
    return [documents.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting client documents count"];
  }
};

export const getSupplierDocumentsCount = async (
  supplierId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.supplierId, supplierId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, "Error getting supplier documents count"];
    return [documents.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting supplier documents count"];
  }
};

export const getItemDocumentsCount = async (
  itemId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.itemId, itemId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, "Error getting item documents count"];
    return [documents.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting item documents count"];
  }
};

export const getProjectDocumentsCount = async (
  projectId: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [documents] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(eq(documentRelationsTable.projectId, projectId))
      .leftJoin(
        documentsTable,
        and(
          eq(documentRelationsTable.documentId, documentsTable.id),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!documents) return [null, "Error getting project documents count"];
    return [documents.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting project documents count"];
  }
};

export const deleteDocumentRelation = async (
  relationId: number,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .delete(documentRelationsTable)
      .where(eq(documentRelationsTable.id, relationId))
      .returning({ id: documentRelationsTable.id });
    if (!result) return [null, "Error deleting document relation"];
    return [result.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error deleting document relation"];
  }
};

export const getDocumentRelationsCount = async (
  id: number,
  accessToPrivate = false,
): Promise<ReturnTuple<number>> => {
  try {
    const [result] = await db
      .select({ count: count() })
      .from(documentRelationsTable)
      .where(
        and(
          eq(documentRelationsTable.documentId, id),
          privateFilterQuery(accessToPrivate),
        ),
      )
      .limit(1);
    if (!result) return [null, "Error getting document relations count"];
    return [result.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document relations count"];
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

    if (!projects) return [null, "Error getting document projects"];
    const parsedProjects = z.array(documentProjectsSchema).safeParse(projects);

    if (parsedProjects.error) return [null, "Error getting document projects"];

    return [parsedProjects.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document projects"];
  }
};

export const documentProjectsCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
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

    if (!projects) return [null, "Error getting document projects count"];
    return [projects.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document projects count"];
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

    if (parsedClients.error) return [null, "Error getting document clients"];

    return [parsedClients.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document clients"];
  }
};

export const documentClientsCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
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

    if (!clients) return [null, "Error getting document clients count"];
    return [clients.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document clients count"];
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

    if (parsedSuppliers.error)
      return [null, "Error getting document suppliers"];

    return [parsedSuppliers.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document suppliers"];
  }
};

export const documentSuppliersCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
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

    if (!suppliers) return [null, "Error getting document suppliers count"];
    return [suppliers.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document suppliers count"];
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

    if (parsedItems.error) return [null, "Error getting document items"];

    return [parsedItems.data, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document items"];
  }
};

export const documentItemsCount = async (
  id: number,
): Promise<ReturnTuple<number>> => {
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

    if (!items) return [null, "Error getting document items count"];
    return [items.count, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting document items count"];
  }
};

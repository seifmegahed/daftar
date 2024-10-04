"use server";

import {
  getClientDocuments,
  getSupplierDocuments,
  getItemDocuments,
  getProjectDocuments,
  getDocumentRelationsCount,
  documentClientsCount,
  documentItemsCount,
  documentProjectsCount,
  documentSuppliersCount,
  getDocumentClients,
  getDocumentItems,
  getDocumentProjects,
  getDocumentSuppliers,
} from "@/server/db/tables/document-relation/queries";

import type {
  DocumentClientsType,
  DocumentItemsType,
  DocumentProjectsType,
  DocumentSuppliersType,
} from "@/server/db/tables/document-relation/queries";

import type { SimpDoc } from "@/server/db/tables/document/queries";
import type { ReturnTuple } from "@/utils/type-utils";

export const getClientDocumentsAction = async (
  clientId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getClientDocuments(clientId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getClientDocumentsCountAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [documents, countError] = await getClientDocuments(clientId);
  if (countError !== null) return [null, countError];
  return [documents.length, null];
};

export const getSupplierDocumentsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getSupplierDocuments(supplierId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getSupplierDocumentsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [documents, countError] = await getSupplierDocuments(supplierId);
  if (countError !== null) return [null, countError];
  return [documents.length, null];
};

export const getItemDocumentsAction = async (
  itemId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getItemDocuments(itemId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getItemDocumentsCountAction = async (
  itemId: number,
): Promise<ReturnTuple<number>> => {
  const [documents, countError] = await getItemDocuments(itemId);
  if (countError !== null) return [null, countError];
  return [documents.length, null];
};

export const getProjectDocumentsAction = async (
  projectId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [documents, documentsError] = await getProjectDocuments(projectId);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getProjectDocumentsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [documents, countError] = await getProjectDocuments(projectId);
  if (countError !== null) return [null, countError];
  return [documents.length, null];
};

export const getDocumentRelationsCountAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const [count, countError] = await getDocumentRelationsCount(id);
  if (countError !== null) return [null, countError];
  return [count, null];
};

export const getDocumentClientsAction = async (
  id: number,
): Promise<ReturnTuple<DocumentClientsType[]>> => {
  const [clients, clientsError] = await getDocumentClients(id);
  if (clientsError !== null) return [null, clientsError];
  return [clients, null];
};

export const getDocumentClientsCountAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const [count, countError] = await documentClientsCount(id);
  if (countError !== null) return [null, countError];
  return [count, null];
};

export const getDocumentItemsAction = async (
  id: number,
): Promise<ReturnTuple<DocumentItemsType[]>> => {
  const [items, itemsError] = await getDocumentItems(id);
  if (itemsError !== null) return [null, itemsError];
  return [items, null];
};

export const getDocumentItemsCountAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const [count, countError] = await documentItemsCount(id);
  if (countError !== null) return [null, countError];
  return [count, null];
};

export const getDocumentProjectsAction = async (
  id: number,
): Promise<ReturnTuple<DocumentProjectsType[]>> => {
  const [projects, projectsError] = await getDocumentProjects(id);
  if (projectsError !== null) return [null, projectsError];
  return [projects, null];
};

export const getDocumentProjectsCountAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const [count, countError] = await documentProjectsCount(id);
  if (countError !== null) return [null, countError];
  return [count, null];
};

export const getDocumentSuppliersAction = async (
  id: number,
): Promise<ReturnTuple<DocumentSuppliersType[]>> => {
  const [suppliers, suppliersError] = await getDocumentSuppliers(id);
  if (suppliersError !== null) return [null, suppliersError];
  return [suppliers, null];
};

export const getDocumentSuppliersCountAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const [count, countError] = await documentSuppliersCount(id);
  if (countError !== null) return [null, countError];
  return [count, null];
};

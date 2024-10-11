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
  getClientDocumentsCount,
  getSupplierDocumentsCount,
  getItemDocumentsCount,
  getProjectDocumentsCount,
} from "@/server/db/tables/document-relation/queries";

import type {
  DocumentClientsType,
  DocumentItemsType,
  DocumentProjectsType,
  DocumentSuppliersType,
} from "@/server/db/tables/document-relation/queries";

import type { SimpDoc } from "@/server/db/tables/document/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { isCurrentUserAdminAction } from "../users";

export const getClientDocumentsAction = async (
  clientId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [documents, documentsError] = await getClientDocuments(clientId, access);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getClientDocumentsCountAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [count, countError] = await getClientDocumentsCount(clientId, access);
  if (countError !== null) return [null, countError];
  return [count, null];
};

export const getSupplierDocumentsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [documents, documentsError] = await getSupplierDocuments(supplierId, access);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getSupplierDocumentsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [count, countError] = await getSupplierDocumentsCount(supplierId, access);
  if (countError !== null) return [null, countError];
  return [count, null];
};

export const getItemDocumentsAction = async (
  itemId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [documents, documentsError] = await getItemDocuments(itemId, access);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getItemDocumentsCountAction = async (
  itemId: number,
): Promise<ReturnTuple<number>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [count, countError] = await getItemDocumentsCount(itemId, access);
  if (countError !== null) return [null, countError];
  return [count, null];
};

export const getProjectDocumentsAction = async (
  projectId: number,
): Promise<ReturnTuple<SimpDoc[]>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [documents, documentsError] = await getProjectDocuments(projectId, access);
  if (documentsError !== null) return [null, documentsError];
  return [documents, null];
};

export const getProjectDocumentsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [access, accessError] = await isCurrentUserAdminAction();
  if (accessError !== null) return [null, "An error occurred requesting access"];
  const [count, countError] = await getProjectDocumentsCount(projectId, access);
  if (countError !== null) return [null, countError];
  return [count, null];
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

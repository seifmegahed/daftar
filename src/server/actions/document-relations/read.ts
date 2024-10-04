"use server";

import {
  getClientDocuments,
  getSupplierDocuments,
  getItemDocuments,
  getProjectDocuments,
  getDocumentRelationsCount,
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

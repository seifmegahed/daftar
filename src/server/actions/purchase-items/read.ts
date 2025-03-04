"use server";

import {
  getItemSuppliers,
  getPurchaseItems,
  getSupplierItems,
  getSupplierProjects,
  getPurchaseItemsCount,
  getSupplierItemsCount,
  getSupplierProjectsCount,
  getItemSuppliersCount,
} from "@/server/db/tables/purchase-item/queries";

import type {
  GetPurchaseItemType,
  ItemSupplierType,
  SupplierItemType,
  SupplierProjectsType,
} from "@/server/db/tables/purchase-item/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { hasAccessToPrivateDataAction } from "../users";

export const getPurchaseItemsAction = async (
  projectId: number,
): Promise<ReturnTuple<GetPurchaseItemType[]>> => {
  const [access] = await hasAccessToPrivateDataAction();
  if (!access) return [null, "Unauthorized"];
  const [projectItems, projectItemsError] = await getPurchaseItems(projectId);
  if (projectItemsError !== null) return [null, projectItemsError];
  return [projectItems, null];
};

export const getPurchaseItemsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [access] = await hasAccessToPrivateDataAction();
  if (!access) return [null, "Unauthorized"];
  const [count, projectItemsError] = await getPurchaseItemsCount(projectId);
  if (projectItemsError !== null) return [null, projectItemsError];
  return [count, null];
};

export const getSupplierProjectsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SupplierProjectsType[]>> => {
  const [projects, projectsError] = await getSupplierProjects(supplierId);
  if (projectsError !== null) return [null, projectsError];
  return [projects, null];
};

export const getSupplierProjectsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [count, projectsError] = await getSupplierProjectsCount(supplierId);
  if (projectsError !== null) return [null, projectsError];
  return [count, null];
};


export const getSupplierItemsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SupplierItemType[]>> => {
  const [access] = await hasAccessToPrivateDataAction();
  if (!access) return [null, "Unauthorized"];
  const [items, error] = await getSupplierItems(supplierId);
  if (error !== null) return [null, error];
  return [items, null];
};

export const getSupplierItemsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [access] = await hasAccessToPrivateDataAction();
  if (!access) return [null, "Unauthorized"];
  const [count, error] = await getSupplierItemsCount(supplierId);
  if (error !== null) return [null, error];
  return [count, null];
};

export const getItemSuppliersAction = async (
  itemId: number,
): Promise<ReturnTuple<ItemSupplierType[]>> => {
  const [suppliers, error] = await getItemSuppliers(itemId);
  if (error !== null) return [null, error];
  return [suppliers, null];
};

export const getItemSuppliersCountAction = async (
  itemId: number,
): Promise<ReturnTuple<number>> => {
  const [count, error] = await getItemSuppliersCount(itemId);
  if (error !== null) return [null, error];
  return [count, null];
};

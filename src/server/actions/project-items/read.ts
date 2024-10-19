"use server";

import {
  getItemProjects,
  getItemSuppliers,
  getProjectItems,
  getSupplierItems,
  getSupplierItemsCount,
  getSupplierProjects,
} from "@/server/db/tables/project-item/queries";

import type {
  GetProjectItemType,
  ItemProjectsType,
  ItemSupplierType,
  SupplierItemType,
  SupplierProjectsType,
} from "@/server/db/tables/project-item/queries";
import type { ReturnTuple } from "@/utils/type-utils";

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
  const [projects, projectsError] = await getSupplierProjects(supplierId);
  if (projectsError !== null) return [null, projectsError];
  return [projects.length, null];
};

export const getProjectItemsAction = async (
  projectId: number,
): Promise<ReturnTuple<GetProjectItemType[]>> => {
  const [projectItems, projectItemsError] = await getProjectItems(projectId);
  if (projectItemsError !== null) return [null, projectItemsError];
  return [projectItems, null];
};

export const getProjectItemsCountAction = async (
  projectId: number,
): Promise<ReturnTuple<number>> => {
  const [projectItems, projectItemsError] = await getProjectItems(projectId);
  if (projectItemsError !== null) return [null, projectItemsError];
  return [projectItems.length, null];
};

export const getSupplierItemsAction = async (
  supplierId: number,
): Promise<ReturnTuple<SupplierItemType[]>> => {
  const [items, error] = await getSupplierItems(supplierId);
  if (error !== null) return [null, error];
  return [items, null];
};

export const getSupplierItemsCountAction = async (
  supplierId: number,
): Promise<ReturnTuple<number>> => {
  const [itemsCount, error] = await getSupplierItemsCount(supplierId);
  if (error !== null) return [null, error];
  return [itemsCount, null];
};

export const getItemProjectsAction = async (
  itemId: number,
): Promise<ReturnTuple<ItemProjectsType[]>> => {
  const [projects, error] = await getItemProjects(itemId);
  if (error !== null) return [null, error];
  return [projects, null];
};

export const getItemProjectsCountAction = async (
  itemId: number,
): Promise<ReturnTuple<number>> => {
  const [itemProjects, error] = await getItemProjects(itemId);
  if (error !== null) return [null, error];
  return [itemProjects.length, null];
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
  const [itemSuppliers, error] = await getItemSuppliers(itemId);
  if (error !== null) return [null, error];
  return [itemSuppliers.length, null];
};

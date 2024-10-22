"use server";

import {
  getProjectById,
  getProjectsBrief,
  getProjectLinkedDocuments,
  getProjectsCount,
  getProjectBriefById,
  getClientProjectsCount,
  getClientProjects,
} from "@/server/db/tables/project/queries";

import type {
  GetProjectType,
  BriefProjectType,
  GetProjectLinkedDocumentsType,
} from "@/server/db/tables/project/queries";
import { hasAccessToPrivateDataAction } from "@/server/actions/users";

import type { SelectProjectType } from "@/server/db/tables/project/schema";
import type { FilterArgs } from "@/components/filter-and-search";
import type { ReturnTuple } from "@/utils/type-utils";

export const getProjectsCountAction = async (
  filter?: FilterArgs,
): Promise<ReturnTuple<number>> => {
  const [projectCount, error] = await getProjectsCount(filter);
  if (error !== null) return [null, error];
  return [projectCount, null];
};

export const getClientProjectsCountAction = async (
  clientId: number,
): Promise<ReturnTuple<number>> => {
  const [projectCount, error] = await getClientProjectsCount(clientId);
  if (error !== null) return [null, error];
  return [projectCount, null];
};

export const getProjectsBriefAction = async (
  page: number,
  filter?: FilterArgs,
  search?: string,
): Promise<ReturnTuple<BriefProjectType[]>> => {
  const [projects, error] = await getProjectsBrief(page, filter, search);
  if (error !== null) return [null, error];
  return [projects, null];
};

export const getClientProjectsAction = async (
  clientId: number,
): Promise<ReturnTuple<BriefProjectType[]>> => {
  const [projects, error] = await getClientProjects(clientId);
  if (error !== null) return [null, error];
  return [projects, null];
};

export const getProjectBriefByIdAction = async (
  id: number,
): Promise<ReturnTuple<SelectProjectType>> => {
  const [project, error] = await getProjectBriefById(id);
  if (error !== null) return [null, error];
  return [project, null];
};

export const getProjectByIdAction = async (
  id: number,
): Promise<ReturnTuple<GetProjectType>> => {
  const [project, error] = await getProjectById(id);
  if (error !== null) return [null, error];
  return [project, null];
};

export const getProjectLinkedDocumentsAction = async (
  projectId: number,
): Promise<ReturnTuple<GetProjectLinkedDocumentsType>> => {
  const [access, accessError] = await hasAccessToPrivateDataAction();
  if (accessError !== null) return [null, accessError];
  const [project, projectError] = await getProjectLinkedDocuments(
    projectId,
    access,
  );
  if (projectError !== null) return [null, projectError];
  return [project, null];
};

"use server";

import {
  getProjectById,
  getProjectsBrief,
  insertProject,
  insertProjectItem,
  getProjectItems,
  getProjectLinkedDocuments,
  type GetProjectType,
  type BriefProjectType,
  type GetProjectItemType,
  type GetProjectLinkedDocumentsType,
  getProjectsCount,
  getProjectBriefById,
} from "@/server/db/tables/project/queries";
import {
  insertProjectItemSchema,
  insertProjectSchema,
  type SelectProjectType,
  type InsertProjectItemType,
} from "@/server/db/tables/project/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "../users";
import type { z } from "zod";

export const getProjectsCountAction = async (): Promise<
  ReturnTuple<number>
> => {
  const [projectCount, error] = await getProjectsCount();
  if (error !== null) return [null, error];
  return [projectCount, null];
};

export const getProjectsBriefAction = async (
  page: number,
  search?: string,
): Promise<ReturnTuple<BriefProjectType[]>> => {
  const [projects, error] = await getProjectsBrief(page, search);
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

const addProjectSchema = insertProjectSchema.omit({
  createdBy: true,
});

type AddProjectFormType = z.infer<typeof addProjectSchema>;

export const addProjectAction = async (
  data: AddProjectFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = addProjectSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [projectId, projectInsertError] = await insertProject({
    name: isValid.data.name,
    status: isValid.data.status,
    description: isValid.data.description,
    notes: isValid.data.notes,
    clientId: isValid.data.clientId,
    ownerId: isValid.data.ownerId,
    createdBy: userId,
  });
  if (projectInsertError !== null) return [null, projectInsertError];

  return [projectId, null];
};

export const addProjectItemAction = async (
  data: InsertProjectItemType,
): Promise<ReturnTuple<number>> => {
  const isValid = insertProjectItemSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [projectItemId, projectItemInsertError] = await insertProjectItem(data);
  if (projectItemInsertError !== null) return [null, projectItemInsertError];

  return [projectItemId, null];
};

export const getProjectItemsAction = async (
  projectId: number,
): Promise<ReturnTuple<GetProjectItemType[]>> => {
  const [projectItems, projectItemsError] = await getProjectItems(projectId);
  if (projectItemsError !== null) return [null, projectItemsError];
  return [projectItems, null];
};

export const getProjectLinkedDocumentsAction = async (
  projectId: number,
): Promise<ReturnTuple<GetProjectLinkedDocumentsType>> => {
  const [project, projectError] = await getProjectLinkedDocuments(projectId);
  if (projectError !== null) return [null, projectError];
  return [project, null];
};

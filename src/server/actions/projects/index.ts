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
  updateProject,
  deleteProject,
} from "@/server/db/tables/project/queries";
import {
  insertProjectItemSchema,
  insertProjectSchema,
  type SelectProjectType,
  type InsertProjectItemType,
} from "@/server/db/tables/project/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserAction, getCurrentUserIdAction } from "../users";
import type { z } from "zod";
import { redirect } from "next/navigation";

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

const updateProjectStatusSchema = insertProjectSchema.pick({
  status: true,
});

type UpdateProjectStatusFormType = z.infer<typeof updateProjectStatusSchema>;

export const updateProjectStatusAction = async (
  id: number,
  data: UpdateProjectStatusFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateProjectStatusSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid form data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [projectId, error] = await updateProject(id, {
    updatedBy: currentUserId,
    status: isValid.data.status,
  });
  if (error !== null) return [null, error];

  return [projectId, null];
};

const updateProjectNameSchema = insertProjectSchema.pick({
  name: true,
  ownerId: true,
});

type UpdateProjectNameFormType = z.infer<typeof updateProjectNameSchema>;

export const updateProjectNameAction = async (
  id: number,
  data: UpdateProjectNameFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateProjectNameSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid form data"];

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (isValid.data.ownerId !== currentUser.id && currentUser.role !== "admin")
    return [null, "Unauthorized"];

  const [projectId, error] = await updateProject(id, {
    updatedBy: currentUser.id,
    name: isValid.data.name,
  });
  if (error !== null) return [null, error];

  return [projectId, null];
};

const updateProjectDescriptionSchema = insertProjectSchema.pick({
  description: true,
});

type UpdateProjectDescriptionFormType = z.infer<
  typeof updateProjectDescriptionSchema
>;

export const updateProjectDescriptionAction = async (
  id: number,
  data: UpdateProjectDescriptionFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateProjectDescriptionSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid form data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [projectId, error] = await updateProject(id, {
    updatedBy: currentUserId,
    description: isValid.data.description,
  });
  if (error !== null) return [null, error];

  return [projectId, null];
};

const updateProjectNotesSchema = insertProjectSchema.pick({
  notes: true,
});

type UpdateProjectNotesFormType = z.infer<typeof updateProjectNotesSchema>;

export const updateProjectNotesAction = async (
  id: number,
  data: UpdateProjectNotesFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateProjectNotesSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid form data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [projectId, error] = await updateProject(id, {
    updatedBy: currentUserId,
    notes: isValid.data.notes ?? null,
  });
  if (error !== null) return [null, error];

  return [projectId, null];
};

const updateProjectDatesSchema = insertProjectSchema.pick({
  startDate: true,
  endDate: true,
});

type UpdateProjectDatesFormType = z.infer<typeof updateProjectDatesSchema>;

export const updateProjectDatesAction = async (
  id: number,
  data: UpdateProjectDatesFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateProjectDatesSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid form data"];

  const [currentUserId, currentUserIdError] = await getCurrentUserIdAction();
  if (currentUserIdError !== null) return [null, currentUserIdError];

  const [projectId, error] = await updateProject(id, {
    updatedBy: currentUserId,
    startDate: isValid.data.startDate,
    endDate: isValid.data.endDate,
  });
  if (error !== null) return [null, error];

  return [projectId, null];
};

const updateProjectOwnerSchema = insertProjectSchema.pick({
  ownerId: true,
});

type UpdateProjectOwnerFormType = z.infer<typeof updateProjectOwnerSchema>;

export const updateProjectOwnerAction = async (
  id: number,
  data: UpdateProjectOwnerFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateProjectOwnerSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid form data"];

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (isValid.data.ownerId !== currentUser.id && currentUser.role !== "admin")
    return [null, "Unauthorized"];

  const [projectId, error] = await updateProject(id, {
    updatedBy: currentUser.id,
    ownerId: isValid.data.ownerId,
  });
  if (error !== null) return [null, error];

  return [projectId, null];
};

const deleteProjectSchema = insertProjectSchema.pick({
  ownerId: true,
});

type DeleteProjectFormType = z.infer<typeof deleteProjectSchema>;

export const deleteProjectAction = async (
  id: number,
  data: DeleteProjectFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = deleteProjectSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid form data"];

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (isValid.data.ownerId !== currentUser.id && currentUser.role !== "admin")
    return [null, "Unauthorized"];

  const [, error] = await deleteProject(id);
  if (error !== null) return [null, error];
  
  redirect("/projects");
};

"use server";

import type { z } from "zod";

import { insertProjectSchema } from "@/server/db/tables/project/schema";
import { updateProject } from "@/server/db/tables/project/queries";

import {
  getCurrentUserAction,
  getCurrentUserIdAction,
} from "@/server/actions/users";

import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";

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
  revalidatePath("projects");
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
  revalidatePath("projects");
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
  revalidatePath("projects");
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
  revalidatePath("projects");
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
  revalidatePath("projects");
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
  revalidatePath("projects");
  return [projectId, null];
};

"use server";

import type { z } from "zod";

import { insertProjectSchema } from "@/server/db/tables/project/schema";
import { insertProject } from "@/server/db/tables/project/queries";

import { getCurrentUserIdAction } from "@/server/actions/users";

import type { ReturnTuple } from "@/utils/type-utils";

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

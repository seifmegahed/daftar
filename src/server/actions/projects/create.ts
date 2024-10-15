"use server";

import type { z } from "zod";

import { insertProjectSchema } from "@/server/db/tables/project/schema";
import { insertProject } from "@/server/db/tables/project/queries";

import { getCurrentUserIdAction } from "@/server/actions/users";

import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { errorLogger } from "@/lib/exceptions";

const projectsErrorLog = errorLogger("Project Create Action Error:");

const addProjectSchema = insertProjectSchema.omit({
  createdBy: true,
});

type AddProjectFormType = z.infer<typeof addProjectSchema>;

export const addProjectAction = async (
  data: AddProjectFormType,
): Promise<ReturnTuple<number> | undefined> => {
  const isValid = addProjectSchema.safeParse(data);
  if (isValid.error) {
    projectsErrorLog(isValid.error);
    return [null, "Invalid data"];
  }

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [, projectInsertError] = await insertProject({
    name: isValid.data.name,
    status: isValid.data.status,
    description: isValid.data.description,
    notes: isValid.data.notes,
    clientId: isValid.data.clientId,
    ownerId: isValid.data.ownerId,
    createdBy: userId,
  });
  if (projectInsertError !== null) return [null, projectInsertError];

  revalidatePath("/projects");
  redirect("/projects");
};

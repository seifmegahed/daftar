"use server";

import type { z } from "zod";

import { insertProjectSchema } from "@/server/db/tables/project/schema";
import { deleteProject } from "@/server/db/tables/project/queries";

import { getCurrentUserAction } from "@/server/actions/users";
import { redirect } from "next/navigation";

import type { ReturnTuple } from "@/utils/type-utils";

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

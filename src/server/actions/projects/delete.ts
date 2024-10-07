"use server";

import { deleteProject, getProjectBriefById } from "@/server/db/tables/project/queries";

import { getCurrentUserAction } from "@/server/actions/users";
import { redirect } from "next/navigation";

import type { ReturnTuple } from "@/utils/type-utils";

export const deleteProjectAction = async (
  id: number,
): Promise<ReturnTuple<number>> => {
  const [projectData, projectDataError] = await getProjectBriefById(id);
  if (projectDataError !== null) return [null, projectDataError];

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (projectData.ownerId !== currentUser.id && currentUser.role !== "admin")
    return [null, "Unauthorized"];

  const [, error] = await deleteProject(id);
  if (error !== null) return [null, error];

  redirect("/projects");
};

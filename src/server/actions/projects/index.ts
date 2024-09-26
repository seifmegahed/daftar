"use server";

import {
  getProjectById,
  getProjectsBrief,
  insertProject,
  type GetProjectType,
  type BriefProjectType,
} from "@/server/db/tables/project/queries";
import { type InsertProjectType } from "@/server/db/tables/project/schema";
import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrentUserIdAction } from "../users";

export const getProjectsBriefAction = async (): Promise<
  ReturnTuple<BriefProjectType[]>
> => {
  const [projects, error] = await getProjectsBrief();
  if (error !== null) return [null, error];
  return [projects, null];
};

export const getProjectByIdAction = async (
  id: number,
): Promise<ReturnTuple<GetProjectType>> => {
  const [project, error] = await getProjectById(id);
  if (error !== null) return [null, error];
  return [project, null];
};

export const addProjectAction = async (
  data: Omit<InsertProjectType, "createdBy" | "updatedBy">,
): Promise<ReturnTuple<number>> => {
  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return [null, userIdError];

  const [projectId, projectInsertError] = await insertProject({
    ...data,
    createdBy: userId,
  });
  if (projectInsertError !== null) return [null, projectInsertError];

  return [projectId, null];
};

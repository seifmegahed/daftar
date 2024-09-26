import { db } from "@/server/db";
import {
  projectsTable,
  type InsertProjectType,
  type SelectProjectType,
} from "./schema";
import type { ReturnTuple } from "@/utils/type-utils";
import type { UserBriefType } from "../user/queries";

export type BriefProjectType = Pick<SelectProjectType, "id" | "name" | "status"> & {
  client: { id: number; name: string };
  owner: UserBriefType;
};

export const getProjectsBrief = async (): Promise<
  ReturnTuple<BriefProjectType[]>
> => {
  try {
    const projects = await db.query.projectsTable.findMany({
      columns: {
        id: true,
        name: true,
        status: true,
      },
      with: {
        client: {
          columns: {
            id: true,
            name: true,
          },
        },
        owner: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!projects) return [null, "Error getting projects"];
    return [projects, null];
  } catch (error) {
    console.log(error);
    return [null, "Error getting projects"];
  }
};

export const insertProject = async (
  data: InsertProjectType,
): Promise<ReturnTuple<number>> => {
  try {
    const [project] = await db
      .insert(projectsTable)
      .values(data)
      .returning({ id: projectsTable.id });

    if (!project) return [null, "Error inserting new project"];
    return [project.id, null];
  } catch (error) {
    console.log(error);
    return [null, "Error inserting new project"];
  }
};

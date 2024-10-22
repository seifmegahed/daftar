import {
  getProjectBriefById,
  getProjectLinkedDocuments,
} from "@/server/db/tables/project/queries";
import { unstable_cache } from "next/cache";
import { tags } from "./tags";

/**
 * projectBrief
 *
 * depends on:
 *  - update project
 *  - delete project
 */
export const getProjectBriefByIdCached = async (id: number) =>
  unstable_cache(getProjectBriefById, [tags.projectBrief(id)]);

export const getProjectLinkedDocumentsCached = (
  id: number,
  access?: boolean,
  path = false,
) =>
  unstable_cache(
    async () => getProjectLinkedDocuments(id, access),
    [tags.projectDocuments(id, access, path)],
  );

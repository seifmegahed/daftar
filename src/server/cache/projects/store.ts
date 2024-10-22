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

export const getProjectLinkedDocumentsCached = unstable_cache(
  async (id: number, access?: boolean, path?: boolean) =>
    getProjectLinkedDocuments(id, access, path),
  ["project-linked-documents"],
);

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

/**
 * projectLinkedDocuments
 * 
 * depends on:
 *  - update project name
 *  - add project relation (link-document) (to any entity)
 *  - delete project relation (unlink-document) (to any entity)
 */
export const getProjectLinkedDocumentsCached = unstable_cache(
  async (id: number, access?: boolean, path?: boolean) =>
    getProjectLinkedDocuments(id, access, path),
  ["project-linked-documents"],
);

import { revalidateTag } from "next/cache";
import { tags } from "./tags";

export const revalidateProjectBrief = (id: number) => {
  revalidateTag(tags.projectBrief(id));
};

export const revalidateProjectLinkedDocuments = (id: number) => {
  revalidateTag(tags.projectDocuments(id));
};

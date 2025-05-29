"use server";

import { getTags } from "@/server/db/tables/tag/queries";
import type { ReturnTuple } from "@/utils/type-utils";

type Tag = {
  id: number;
  name: string;
};

export const getTagsAction = async (): Promise<ReturnTuple<Tag[]>> => {
  const [result, error] = await getTags();

  if (error !== null) {
    console.error("Error fetching tags:", error);
    return [null, "Error fetching tags"];
  }

  return [result, null];
};

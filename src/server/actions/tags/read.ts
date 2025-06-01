"use server";

import { getTags, getTagSuggestions } from "@/server/db/tables/tag/queries";
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

export const getTagSuggestionsAction = async (
  searchTerm: string,
): Promise<ReturnTuple<Tag[]>> => {
  const [result, error] = await getTagSuggestions(searchTerm);

  if (error !== null) {
    console.error("Error fetching tag suggestions:", error);
    return [null, error];
  }

  return [result, null];
};

import { db } from "../..";
import { tagTable } from "./schema";
import { ilike } from "drizzle-orm";

import type { ReturnTuple } from "@/utils/type-utils";

type Tag = { id: number; name: string };

export const getTags = async (): Promise<ReturnTuple<Tag[]>> => {
  try {
    const result = await db.select().from(tagTable);

    if (!result.length) return [null, "No tags found"];

    return [result, null];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [null, "Error fetching tags"];
  }
};

export const getTagSuggestions = async (
  searchTerm: string
): Promise<ReturnTuple<Tag[]>> => {
  try {
    const result = await db
      .select()
      .from(tagTable)
      .where(ilike(tagTable.name, `%${searchTerm}%`))
      .limit(10);

    return [result, null];
  } catch (error) {
    console.error("Error fetching tag suggestions:", error);
    return [null, "Error fetching tag suggestions"];
  }
}
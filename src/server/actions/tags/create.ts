"use server";

import { z } from "zod";

import { addSupplierTags } from "@/server/db/tables/supplier-tag/mutations";
import type { ReturnTuple } from "@/utils/type-utils";

const addSupplierTagsSchema = z.object({
  supplierId: z.number().positive(),
  tags: z.array(z.object({ name: z.string().min(3) })).min(1),
});

export const addSupplierTagsAction = async (
  supplierId: number,
  tags: { name: string }[],
): Promise<ReturnTuple<boolean>> => {
  const validation = addSupplierTagsSchema.safeParse({
    supplierId,
    tags,
  });
  
  if (!validation.success) {
    return [null, "Invalid input data"];
  }

  const [, error] = await addSupplierTags(validation.data);

  if (error) return [null, "Error adding supplier tags"];

  return [true, null];
};

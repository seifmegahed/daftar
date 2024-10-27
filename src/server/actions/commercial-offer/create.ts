"use server";

import { generateCommercialOfferFile } from "@/lib/pdf-generator/generate";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { getProjectByIdAction } from "@/server/actions/projects/read";

import type { ReturnTuple } from "@/utils/type-utils";

type GenerateCommercialOfferArgs = {
  projectId: number;
};

export const createCommercialOffer = async (
  args: GenerateCommercialOfferArgs,
): Promise<ReturnTuple<{ buffer: ArrayBuffer; name: string }>> => {
  const { projectId } = args;

  const [project, projectError] = await getProjectByIdAction(projectId);
  if (projectError !== null) return [null, projectError];

  const [saleItems, saleItemsError] =
    await getProjectSaleItemsAction(projectId);
  if (saleItemsError !== null) return [null, saleItemsError];
  if (saleItems.length === 0) return [null, "No items found"];

  const [file, error] = await generateCommercialOfferFile({
    project,
    saleItems,
  });
  if (error !== null) return [null, error];

  return [file, null];
};

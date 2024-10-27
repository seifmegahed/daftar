"use server";

import { generateCommercialOfferFile } from "@/lib/pdf-generator/generate";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { getProjectByIdAction } from "@/server/actions/projects/read";
import { saveDocumentFile } from "../documents/create";
import { getCurrentUserIdAction } from "../users";
import { insertDocumentWithRelation } from "@/server/db/tables/document-relation/mutations";

import type { ReturnTuple } from "@/utils/type-utils";

type GenerateCommercialOfferArgs = {
  projectId: number;
};

export const createCommercialOffer = async (
  args: GenerateCommercialOfferArgs,
): Promise<ReturnTuple<File>> => {
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

  const [path, pathError] = await saveDocumentFile(file);
  if (pathError !== null) return [null, pathError];

  const [currentUserId, currentUserError] = await getCurrentUserIdAction();
  if (currentUserError !== null) return [null, currentUserError];

  const [, documentError] = await insertDocumentWithRelation(
    {
      name: `Commercial Offer - ${file.name.split(".")[0]}`,
      private: true,
      path,
      createdBy: currentUserId,
      extension: "pdf",
    },
    {
      projectId: project.id,
      itemId: null,
      supplierId: null,
      clientId: null,
    },
  );
  if (documentError !== null) return [null, documentError];

  return [file, null];
};

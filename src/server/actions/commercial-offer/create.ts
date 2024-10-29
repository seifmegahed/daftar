"use server";

import { generateCommercialOfferFile } from "@/lib/pdf-generator/generate";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { getProjectByIdAction } from "@/server/actions/projects/read";
import { saveDocumentFile } from "../documents/create";
import { getCurrentUserIdAction } from "../users";
import { insertDocumentWithRelation } from "@/server/db/tables/document-relation/mutations";

import type { ReturnTuple } from "@/utils/type-utils";
import { getCurrencyLabel } from "@/data/lut";

type GenerateCommercialOfferArgs = {
  projectId: number;
  companyName?: string;
  companyAddress?: string;
  companyCountry?: string;
  companyPhoneNmA?: string;
  companyPhoneNmB?: string;
  companyEmail?: string;
  offerValidityInDays?: number;
  advancePercentage?: number;
  deliveryPeriod?: string;
};

export const createCommercialOffer = async (
  formData: FormData,
): Promise<ReturnTuple<File>> => {
  const [args, parseError] = parseFormData(formData);
  if (parseError !== null) return [null, parseError];

  const { projectId } = args;

  const [project, projectError] = await getProjectByIdAction(projectId);
  if (projectError !== null) return [null, projectError];

  const [saleItems, saleItemsError] =
    await getProjectSaleItemsAction(projectId);
  if (saleItemsError !== null) return [null, saleItemsError];
  if (saleItems.length === 0) return [null, "No items found"];

  const [file, error] = await generateCommercialOfferFile({
    project,
    saleItems: saleItems.map((value) => ({
      ...value,
      currency: getCurrencyLabel(value.currency),
    })),
    otherData: args,
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

const parseFormData = (
  formData: FormData,
): ReturnTuple<GenerateCommercialOfferArgs> => {
  const projectId = parseInt(formData.get("id")?.toString() ?? "");
  if (isNaN(projectId)) return [null, "Invalid id"];
  const companyName = formData.get("companyName")?.toString();
  const companyAddress = formData.get("companyAddress")?.toString();
  const companyCountry = formData.get("companyCountry")?.toString();
  const companyPhoneNmA = formData.get("companyPhoneNmA")?.toString();
  const companyPhoneNmB = formData.get("companyPhoneNmB")?.toString();
  const companyEmail = formData.get("companyEmail")?.toString();
  const offerValidityInDays = formData.get("offerValidityInDays")?.toString();
  const advancePercentage = formData.get("advancePercentage")?.toString();
  const deliveryPeriod = formData.get("deliveryPeriod")?.toString();
  if (advancePercentage && isNaN(parseInt(advancePercentage)))
    return [null, "Invalid advance percentage"];
  if (offerValidityInDays && isNaN(parseInt(offerValidityInDays)))
    return [null, "Invalid offer validity"];
  return [
    {
      projectId,
      companyName,
      companyAddress,
      companyCountry,
      companyPhoneNmA,
      companyPhoneNmB,
      companyEmail,
      offerValidityInDays: offerValidityInDays
        ? parseInt(offerValidityInDays)
        : undefined,
      advancePercentage: advancePercentage
        ? parseInt(advancePercentage)
        : undefined,
      deliveryPeriod,
    },
    null,
  ];
};

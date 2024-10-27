import { commercialOfferInputSchema } from "./schema";
import { numberWithCommas } from "@/utils/common";

import type { GetProjectType } from "@/server/db/tables/project/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import type { CommercialOfferInputType } from "./schema";

export const prepareInputs = (
  data: {
    project: GetProjectType;
    saleItems: Array<{ name: string; quantity: number; price: string }>;
    otherData: {
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
  },
  offerReference: string,
): ReturnTuple<CommercialOfferInputType> => {
  const { project, saleItems } = data;
  let total = 0;
  for (const saleItem of saleItems) {
    total += parseFloat(saleItem.price) * saleItem.quantity;
  }

  const saleItemsSection = saleItems.map((saleItem) => {
    const { quantity, name } = saleItem;
    const price = parseFloat(saleItem.price);
    const total = price * quantity;
    return {
      name,
      quantity: String(quantity),
      price: numberWithCommas(price),
      total: numberWithCommas(total),
    };
  });

  const totalSection = {
    name: "",
    quantity: "",
    price: "",
    total: numberWithCommas(total),
  };

  const inputsParsed = commercialOfferInputSchema.safeParse({
    title: data.otherData.companyName,
    companyField: {
      companyAddress: data.otherData.companyAddress,
      companyCountry: data.otherData.companyCountry,
      companyPhoneNmA: data.otherData.companyPhoneNmA,
      companyPhoneNmB: data.otherData.companyPhoneNmB,
      companyEmail: data.otherData.companyEmail,
    },
    offerValidity: {
      companyName: data.otherData.companyName,
      offerValidityInDays: String(data.otherData.offerValidityInDays),
    },
    payment: {
      paymentAdvance: data.otherData.advancePercentage, // needs further implementation
    },
    deliveryPeriod: {
      deliveryPeriod: data.otherData.deliveryPeriod,
    },
    clientName: project.client.name,
    clientField: {
      clientAddress: project.client.primaryAddress?.addressLine ?? "",
      clientCountry:
        project.client.primaryAddress?.country ??
        "" +
          (project.client.primaryAddress?.city
            ? ", " + project.client.primaryAddress.city
            : ""),
      clientPhoneNumber: project.client.primaryContact?.phoneNumber ?? "N/A",
      clientEmail: project.client.primaryContact?.email ?? "N/A",
    },
    projectData: {
      offerReference,
      projectName: project.name,
      projectManager: project.owner.name,
    },
    items: [...saleItemsSection, totalSection],
  });

  if (inputsParsed.error) {
    console.log(inputsParsed.error.errors);
    return [null, "Invalid data"];
  }
  return [inputsParsed.data, null];
};

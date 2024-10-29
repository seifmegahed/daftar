import { commercialOfferInputSchema } from "./schema";
import { numberWithCommas } from "@/utils/common";

import type { GetProjectType } from "@/server/db/tables/project/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import type { CommercialOfferInputType } from "./schema";

export const prepareInputs = (
  data: {
    project: GetProjectType;
    saleItems: Array<{
      name: string;
      quantity: number;
      price: string;
      currency: string;
    }>;
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
  const { project, saleItems, otherData } = data;

  const items = saleItems.map((saleItem) => {
    const { quantity, name } = saleItem;
    const price = parseFloat(saleItem.price);
    const total = price * quantity;
    return {
      name,
      quantity: String(quantity),
      price: numberWithCommas(price),
      total: numberWithCommas(total),
      cur: saleItem.currency,
    };
  });

  const currencies: string[] = [];
  for (const saleItem of saleItems) {
    if (!currencies.includes(saleItem.currency)) {
      currencies.push(saleItem.currency);
    }
  }

  for (const currency of currencies) {
    const total = saleItems.reduce((acc, saleItem) => {
      if (saleItem.currency === currency) {
        return acc + parseFloat(saleItem.price) * saleItem.quantity;
      }
      return acc;
    }, 0);
    items.push({
      name: `Total (${currency})`,
      quantity: "",
      price: "",
      total: numberWithCommas(total),
      cur: currency,
    });
  }

  const postPercentage = otherData.advancePercentage
    ? String(100 - otherData.advancePercentage)
    : undefined;

  const inputs = {
    title: data.otherData.companyName,
    companyField: {
      companyAddress: otherData.companyAddress,
      companyCountry: otherData.companyCountry,
      companyPhoneNmA: otherData.companyPhoneNmA,
      companyPhoneNmB: otherData.companyPhoneNmB,
      companyEmail: otherData.companyEmail,
    },
    offerValidity: {
      companyName: otherData.companyName,
      offerValidityInDays: String(otherData.offerValidityInDays),
    },
    payment: {
      advancePercentage: String(otherData.advancePercentage),
      postPercentage,
    },
    deliveryPeriod: {
      deliveryPeriod: otherData.deliveryPeriod,
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
      ownerNumber: project.owner.phoneNumber,
      ownerEmail: project.owner.email,
    },
    items,
  };

  const inputsParsed = commercialOfferInputSchema.safeParse(inputs);

  if (inputsParsed.error) {
    console.log(inputsParsed.error.errors);
    return [null, "Invalid data"];
  }
  return [inputsParsed.data, null];
};

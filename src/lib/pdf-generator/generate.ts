import { generate } from "@pdfme/generator";
import { text, line, multiVariableText, table, svg } from "@pdfme/schemas";

import { prepareInputs } from "./prepare";
import { template } from "./template";
import { font } from "./font";

import type { ReturnTuple } from "@/utils/type-utils";
import type { GetProjectType } from "@/server/db/tables/project/queries";

export const generateCommercialOfferFile = async (data: {
  project: GetProjectType;
  saleItems: Array<{ name: string; quantity: number; price: string }>;
}): Promise<ReturnTuple<{ buffer: ArrayBuffer; name: string }>> => {
  const { project, saleItems } = data;
  const offerReference = `P${project.id}C-${Date.now().toString(16).toUpperCase()}`;
  
  const [inputs, inputsError] = prepareInputs(
    {
      project: project,
      saleItems: saleItems,
    },
    offerReference,
  );
  if (inputsError !== null) return [null, inputsError];

  try {
    const pdf = await generate({
      template,
      options: { font },
      inputs: [inputs],
      plugins: { text, table, line, multiVariableText, svg },
    });

    if (!pdf) return [null, "Error generating PDF"];

    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    const buffer = await blob.arrayBuffer();
    const name = `${offerReference}.pdf`;

    return [{ buffer, name }, null];
  } catch (error) {
    console.error(error);
    return [null, "Error generating PDF"];
  }
};

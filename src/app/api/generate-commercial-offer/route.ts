import { generate } from "@pdfme/generator";
import { template, templateSchema } from "./template";
import { text, line, multiVariableText, table, svg } from "@pdfme/schemas";
import { getProjectByIdAction } from "@/server/actions/projects/read";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { numberWithCommas } from "@/utils/common";

import type { NextRequest } from "next/server";
import type { Font } from "@pdfme/common";
import fs from "node:fs/promises";

const readexPro = await fs.readFile(
  "public/fonts/Readex_Pro/static/ReadexPro-ExtraLight.ttf",
);
const readexProBold = await fs.readFile(
  "public/fonts/Readex_Pro/static/ReadexPro-SemiBold.ttf",
);
const readexProFontData = Buffer.from(readexPro).toString("base64");
const readexProBoldFontData = Buffer.from(readexProBold).toString("base64");

const font: Font = {
  readexPro: {
    data: readexProFontData,
    fallback: true,
  },
  readexProBold: {
    data: readexProBoldFontData,
  },
};

export async function POST(request: NextRequest) {
  console.log("API Called");
  const formData = await request.formData();
  const id = parseInt(formData.get("id")?.toString() ?? "");

  if (isNaN(id)) {
    console.log("Invalid id");
    return new Response("Invalid id", { status: 400 });
  }

  const [project, error] = await getProjectByIdAction(id);
  if (error !== null) {
    console.log("Not found");
    return new Response("Not found", { status: 404 });
  }

  const [saleItems, saleItemsError] = await getProjectSaleItemsAction(id);
  if (saleItemsError !== null) {
    console.log("Not found");
    return new Response("Not found", { status: 404 });
  }
  if (saleItems.length === 0) {
    console.log("No items found");
    return new Response("No items found", { status: 404 });
  }

  const offerReference = `P${project.id}C-${Date.now().toString(16).toUpperCase()}`;

  const { client } = project;

  let total = 0;
  for (const saleItem of saleItems) {
    total += parseFloat(saleItem.price) * saleItem.quantity;
  }

  const inputsParsed = templateSchema.safeParse({
    clientName: client.name,
    clientField: {
      clientAddress: client.primaryAddress?.addressLine ?? "",
      clientCountry:
        client.primaryAddress?.country ??
        "" +
          (client.primaryAddress?.city
            ? ", " + client.primaryAddress.city
            : ""),
      clientPhoneNumber: project.client.primaryContact?.phoneNumber ?? "N/A",
      clientEmail: project.client.primaryContact?.email ?? "N/A",
    },
    projectData: {
      offerReference: offerReference,
      projectName: project.name,
      projectManager: project.owner.name,
    },
    items: [
      ...saleItems.map((saleItem) => {
        const { quantity, name } = saleItem;
        const price = parseFloat(saleItem.price);
        const total = price * quantity;
        return {
          name,
          quantity: String(quantity),
          price: numberWithCommas(price),
          total: numberWithCommas(total),
        };
      }),
      {
        name: "",
        quantity: "",
        price: "",
        total: numberWithCommas(total),
      },
    ],
  });

  if (inputsParsed.error) {
    console.log(inputsParsed.error.errors);
    return new Response("Invalid data", { status: 400 });
  }

  console.log("Generating PDF");

  const pdf = await generate({
    template,
    options: { font },
    inputs: [inputsParsed.data],
    plugins: { text, table, line, multiVariableText, svg },
  }).catch((error) => console.error(error));

  if (!pdf) return new Response("Error generating PDF", { status: 500 });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  const arrayBuffer = await blob.arrayBuffer();
  const filename = `${offerReference}.pdf`;

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

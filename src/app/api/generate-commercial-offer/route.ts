import { generate } from "@pdfme/generator";
import { template, templateSchema } from "./template";
import { text, line, multiVariableText, table, svg } from "@pdfme/schemas";
import { getProjectByIdAction } from "@/server/actions/projects/read";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { numberWithCommas } from "@/utils/common";

import type { NextRequest } from "next/server";
import type { Font } from "@pdfme/common";
import fs from "node:fs/promises";

const amiri = await fs.readFile("public/fonts/amiri/Amiri-Regular.ttf");
const amiriBold = await fs.readFile("public/fonts/amiri/Amiri-Bold.ttf");
const amiriFontData = Buffer.from(amiri).toString("base64");
const amiriBoldFontData = Buffer.from(amiriBold).toString("base64");

const font: Font = {
  amiri: {
    data: amiriFontData,
    fallback: true,
  },
  amiriBold: {
    data: amiriBoldFontData,
  },
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = parseInt(formData.get("id")?.toString() ?? "");
  if (isNaN(id)) return new Response("Invalid id", { status: 400 });

  const [project, error] = await getProjectByIdAction(id);
  if (error !== null) return new Response("Not found", { status: 404 });

  const [saleItems, saleItemsError] = await getProjectSaleItemsAction(id);
  if (saleItemsError !== null)
    return new Response("Not found", { status: 404 });

  if (saleItems.length === 0)
    return new Response("No items found", { status: 404 });

  const offerReference = `P${project.id}CO${Date.now()}`;

  const { client } = project;

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
    items: saleItems.map((saleItem) => {
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
  });

  if (inputsParsed.error) {
    console.log(inputsParsed.error.errors);
    return new Response("Invalid data", { status: 400 });
  }

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

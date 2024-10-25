import type { NextRequest } from "next/server";
import { generate } from "@pdfme/generator";
import { template } from "./template";
import { text, line, multiVariableText, table, svg } from "@pdfme/schemas";
import { getProjectByIdAction } from "@/server/actions/projects/read";
import { getProjectSaleItemsAction } from "@/server/actions/sale-items/read";
import { numberWithCommas } from "@/utils/common";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = parseInt(formData.get("id")?.toString() ?? "");
  if (isNaN(id)) return new Response("Invalid id", { status: 400 });

  const [project, error] = await getProjectByIdAction(id);
  if (error !== null) return new Response("Not found", { status: 404 });

  const [saleItems, saleItemsError] = await getProjectSaleItemsAction(id);
  if (saleItemsError !== null)
    return new Response("Error getting sale items", { status: 500 });

  const { client } = project;
  const pdf = await generate({
    template,
    inputs: [
      {
        billedToInput: client.name,
        orders: saleItems.map((saleItem) => {
          const { quantity, name, price } = saleItem;
          const total = parseFloat(price) * saleItem.quantity;
          return [
            name,
            String(quantity),
            numberWithCommas(parseFloat(price)),
            numberWithCommas(total),
          ];
        }),
      },
    ],
    plugins: { text, table, line, multiVariableText, svg },
  }).catch((error) => console.error(error));

  if (!pdf) return new Response("Error generating PDF", { status: 500 });

  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  const blobStream = blob.stream();
  const filename = `PCO${project.id}-${project.name}-${Date.now()}.pdf`;

  return new Response(blobStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

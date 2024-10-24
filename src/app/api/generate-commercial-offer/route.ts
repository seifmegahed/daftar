import type { NextRequest } from "next/server";
import { generate } from "@pdfme/generator";
import { template } from "./template";
import { getProjectByIdAction } from "@/server/actions/projects/read";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = parseInt(formData.get("id")?.toString() ?? "");
  if (isNaN(id)) return new Response("Invalid id", { status: 400 });

  const [project, error] = await getProjectByIdAction(id);
  if (error !== null) return new Response("Not found", { status: 404 });

  const { name, description, startDate } = project;
  const pdf = await generate({
    template,
    inputs: [{ a: name, b: description, c: startDate }],
  });

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

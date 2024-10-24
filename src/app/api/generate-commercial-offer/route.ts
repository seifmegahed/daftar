import type { NextRequest } from "next/server";
import { generate } from "@pdfme/generator";
import { template } from "./template";

const inputs = [{ a: "a1", b: "b1", c: "c1" }];
export async function POST(_request: NextRequest) {
  const pdf = await generate({ template, inputs });
  
  const blob = new Blob([pdf.buffer], { type: "application/pdf" });
  const blobStream = blob.stream();

  return new Response(blobStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="hello.pdf"`,
    },
  });
}

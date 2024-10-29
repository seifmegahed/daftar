import { createCommercialOffer } from "@/server/actions/commercial-offer/create";

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const [file, error] = await createCommercialOffer(formData);
  if (error !== null)
    return new Response("An error occurred while generating the file", {
      status: 500,
    });

  return new Response(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file.name}"`,
    },
  });
}

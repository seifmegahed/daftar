import { createCommercialOffer } from "@/server/actions/commercial-offer/create";
import { getCurrentUserIdAction } from "@/server/actions/users";

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const [, userError] = await getCurrentUserIdAction();
  if (userError !== null) {
    return new Response(userError, { status: 500 });
  }
  
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

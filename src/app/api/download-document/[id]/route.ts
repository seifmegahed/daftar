import { getDocumentPath } from "@/server/db/tables/document/queries";
import { NextResponse, type NextRequest } from "next/server";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const documentId = Number(id);
    if (isNaN(documentId)) {
      return new Response("Invalid ID", { status: 400 });
    }

    const [document, documentError] = await getDocumentPath(documentId);
    if (documentError !== null) {
      return new Response("Error getting document path", {
        status: 500,
      });
    }

    const file = fs.readFileSync(document.path);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=${document.name + "." + document.extension}`,
      },
    });
  } catch (error) {
    console.error("Error serving document:", error);
    return new Response("Error serving document", { status: 500 });
  }
}

import { getDocumentPath } from "@/server/db/tables/document/queries";
import { NextResponse, type NextRequest } from "next/server";
import fs from "fs/promises";
import { isCurrentUserAdminAction } from "@/server/actions/users";
import { env } from "@/env";

const demoFileUrl =
  "https://utfs.io/f/8hxXWP1VU3rzZIfsDqVanCtxq3HPsDF41gMzIe7XL6l9mUAw";

async function demoDownload({ fileName }: { fileName: string }) {
  const file = await fetch(demoFileUrl);

  if (!file.ok) {
    new Response("Error downloading demo file", { status: 500 });
  }

  return new NextResponse(file.body, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${fileName}.pdf`,
    },
  });
}

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

    const [access, accessError] = await isCurrentUserAdminAction();
    if (accessError !== null) {
      return new Response("Error checking access", {
        status: 500,
      });
    }

    const [document, documentError] = await getDocumentPath(documentId, access);
    if (documentError !== null) {
      return new Response("Error getting document", {
        status: 500,
      });
    }

    if (env.NEXT_PUBLIC_VERCEL)
      return await demoDownload({ fileName: document.name });

    const fileStatus = await fs.open(document.path, "r");
    const fileStats = await fileStatus.stat();
    if (fileStats.isDirectory())
      return new Response("Document is a directory", { status: 500 });
    if (!fileStats.isFile())
      return new Response("Document is not a file", { status: 500 });

    const file = await fs.readFile(document.path);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=${document.name}`,
      },
    });
  } catch (error) {
    console.error("Error serving document:", error);
    return new Response("Error serving document", { status: 500 });
  }
}

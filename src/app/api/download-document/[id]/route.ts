import fs from "fs/promises";
import { NextResponse } from "next/server";
import { env } from "@/env";

import { getDocumentPath } from "@/server/db/tables/document/queries";
import { isCurrentUserAdminAction } from "@/server/actions/users";

import type { NextRequest } from "next/server";
import { errorLogger } from "@/lib/exceptions";


const downloadDocumentErrorLog = errorLogger("Download Document API Error:");

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
      return new Response(accessError, {
        status: 500,
      });
    }

    const [document, documentError] = await getDocumentPath(documentId, access);
    if (documentError !== null) {
      return new Response(documentError, {
        status: 500,
      });
    }

    if (env.NEXT_PUBLIC_VERCEL)
      return await demoDownload({ fileName: document.name });

    const fileStatus = await fs.open(document.path, "r");
    const fileStats = await fileStatus.stat();
    if (fileStats.isDirectory()) {
      downloadDocumentErrorLog(`Document file ${document.path} is a directory`);
      return new Response("Document does not exist", { status: 500 });
    }
    if (!fileStats.isFile()) {
      downloadDocumentErrorLog(`Document file ${document.path} does not exist`);
      return new Response("Document does not exist", { status: 500 });
    }

    const file = await fs.readFile(document.path);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename=${document.name}`,
      },
    });
  } catch (error) {
    downloadDocumentErrorLog(error);
    return new Response("An error occurred while getting document", {
      status: 500,
    });
  }
}

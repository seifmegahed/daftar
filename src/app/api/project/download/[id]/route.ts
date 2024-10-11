import { NextResponse, type NextRequest } from "next/server";
import fs, { existsSync } from "fs";
import { getProjectLinkedDocuments } from "@/server/db/tables/project/queries";
import AdmZip from "adm-zip";
import { isCurrentUserAdminAction } from "@/server/actions/users";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const projectId = Number(id);
    if (isNaN(projectId)) {
      return new Response("Invalid ID", { status: 400 });
    }

    const [access, accessError] = await isCurrentUserAdminAction();
    if (accessError !== null) {
      return new Response("Error checking access", { status: 500 });
    }

    const [projectDocuments, projectDocumentsError] =
      await getProjectLinkedDocuments(projectId, access, true);
    if (projectDocumentsError !== null) {
      return new Response("Error getting project", { status: 500 });
    }

    if (!existsSync(`tmp`)) {
      fs.mkdirSync(`tmp`);
    }

    const folderName = `daftar-pr${id}-docs-${Date.now()}`;
    const tempFolderPath = `./tmp/${folderName}`;
    fs.mkdirSync(tempFolderPath);

    for (const projectDoc of projectDocuments.projectDocuments) {
      if (!projectDoc.path) continue;
      fs.copyFileSync(
        projectDoc.path,
        `${tempFolderPath}/${projectDoc.name}.${projectDoc.extension}`,
      );
    }

    for (const clientDoc of projectDocuments.clientDocuments) {
      if (!clientDoc.path) continue;
      fs.copyFileSync(
        clientDoc.path,
        `${tempFolderPath}/${clientDoc.name}.${clientDoc.extension}`,
      );
    }

    for (const itemDoc of projectDocuments.itemsDocuments) {
      if (!itemDoc.path) continue;
      fs.copyFileSync(
        itemDoc.path,
        `${tempFolderPath}/${itemDoc.name}.${itemDoc.extension}`,
      );
    }

    for (const supplierDoc of projectDocuments.suppliersDocuments) {
      if (!supplierDoc.path) continue;
      fs.copyFileSync(
        supplierDoc.path,
        `${tempFolderPath}/${supplierDoc.name}.${supplierDoc.extension}`,
      );
    }

    const zip = new AdmZip();
    zip.addLocalFolder(tempFolderPath);
    const zipFilePath = `/tmp/${folderName}.zip`;
    zip.writeZip(zipFilePath);

    const zipFile = fs.readFileSync(zipFilePath);
    const response = new NextResponse(new Blob([zipFile]), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${folderName}.zip`,
      },
    });

    fs.rmSync(tempFolderPath, { recursive: true, force: true });
    fs.rmSync(zipFilePath, { force: true });

    return response;
  } catch (error) {
    console.error("Error serving project documents:", error);
    return new Response("Error serving project documents", { status: 500 });
  }
}

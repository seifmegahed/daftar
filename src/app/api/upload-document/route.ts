/**
 * Document File Uploading can't be done using Server Actions because the
 * Server Actions cannot accept files as arguments.
 *
 * This is why we have to use an API route instead.
 *
 * This API route is used to upload a file, and insert it's reference data into
 * the database.
 */
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { deleteFileAction } from "@/server/actions/documents/delete";
import { saveDocumentFile } from "@/server/actions/documents/create";
import { insertDocument } from "@/server/db/tables/document/mutations";
import { getCurrentUserIdAction } from "@/server/actions/users";
import { documentSchema } from "@/server/db/tables/document/schema";

import { errorLogger } from "@/lib/exceptions";

import type { NextRequest } from "next/server";

const uploadErrorLog = errorLogger("Upload Document API Error:");

const requestSchema = z.object({
  document: documentSchema.pick({
    name: true,
    notes: true,
    private: true,
  }),
  file: z.instanceof(File),
});

export async function POST(request: NextRequest) {
  const [userId, userError] = await getCurrentUserIdAction();
  if (userError !== null) {
    return new Response(userError, { status: 500 });
  }

  const formData = await request.formData();

  const documentJson = formData.get("document") as string;
  const file = formData.get("file");

  if (!documentJson || !file || !(file instanceof File)) {
    return new Response("Invalid form data", { status: 400 });
  }

  // Safely parse the stringified JSON fields
  let document, relation;
  try {
    document = JSON.parse(documentJson) as z.infer<
      typeof requestSchema.shape.document
    >;
  } catch (parseError) {
    uploadErrorLog(parseError);
    return new Response("Invalid JSON format", { status: 400 });
  }

  const result = requestSchema.safeParse({ document, relation, file });
  if (result.error) {
    uploadErrorLog(result.error);
    return new Response("An error occurred while validating form data", {
      status: 400,
    });
  }

  const { document: validatedDocument, file: validatedFile } = result.data;

  const [path, saveError] = await saveDocumentFile(validatedFile);
  if (saveError !== null) return new Response(saveError, { status: 500 });

  const extension = validatedFile.name.split(".").pop();
  if (!extension) {
    uploadErrorLog(`File ${validatedFile.name} has no extension`);
    return new Response("Invalid file extension", { status: 400 });
  }

  const [, documentInsertError] = await insertDocument({
    name: validatedDocument.name,
    notes: validatedDocument.notes,
    private: validatedDocument.private,
    path,
    extension,
    createdBy: userId,
  });

  if (documentInsertError !== null) {
    await deleteFileAction(path);
    return new Response(documentInsertError, { status: 500 });
  }
  revalidatePath("/documents");
  return new Response("Document added successfully", { status: 200 });
}

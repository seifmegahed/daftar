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
import { type NextRequest } from "next/server";
import { documentSchema } from "@/server/db/tables/document/schema";
import { saveDocumentFile } from "@/server/actions/documents/create";
import { insertDocument } from "@/server/db/tables/document/queries";
import { getCurrentUserIdAction } from "@/server/actions/users";

const requestSchema = z.object({
  document: documentSchema.pick({
    name: true,
    notes: true,
    private: true,
  }),
  file: z.instanceof(File),
});

export async function POST(request: NextRequest) {
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
    console.log(parseError);
    return new Response("Invalid JSON format", { status: 400 });
  }

  const result = requestSchema.safeParse({ document, relation, file });
  if (!result.success) {
    return new Response(result.error.message, { status: 400 });
  }

  const { document: validatedDocument, file: validatedFile } = result.data;

  const [userId, userIdError] = await getCurrentUserIdAction();
  if (userIdError !== null) return new Response(userIdError, { status: 500 });

  const [path, saveError] = await saveDocumentFile(validatedFile);
  if (saveError !== null) return new Response(saveError, { status: 500 });

  const extension = validatedFile.name.split(".").pop();
  if (!extension)
    return new Response("Invalid file extension", { status: 400 });

  const [, documentInsertError] = await insertDocument({
    name: validatedDocument.name,
    notes: validatedDocument.notes,
    private: validatedDocument.private,
    path,
    extension,
    createdBy: userId,
  });

  if (documentInsertError !== null)
    return new Response(documentInsertError, { status: 500 });

  return new Response("Document added successfully", { status: 200 });
}

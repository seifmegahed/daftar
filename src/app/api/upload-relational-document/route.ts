import {
  documentSchema,
  documentRelationsSchema,
  type DocumentRelationsType,
} from "@/server/db/tables/document/schema";
import { type NextRequest } from "next/server";
import { z } from "zod";
import { saveDocumentFile } from "@/server/actions/documents";
import { insertDocumentWithRelation } from "@/server/db/tables/document/queries";
import { getCurrentUserIdAction } from "@/server/actions/users";

// Define the validation schema for the request
const requestSchema = z.object({
  document: documentSchema.pick({
    name: true,
    notes: true,
  }),
  relation: documentRelationsSchema,
  file: z.instanceof(File),
});

export async function POST(request: NextRequest) {
  try {
    // Retrieve form data from the request
    const formData = await request.formData();

    // Extract and parse JSON stringified fields
    const documentJson = formData.get("document") as string;
    const relationJson = formData.get("relation") as string;
    const file = formData.get("file");

    if (!documentJson || !relationJson || !file || !(file instanceof File)) {
      return new Response("Invalid form data", { status: 400 });
    }

    // Safely parse the stringified JSON fields
    let document, relation;
    try {
      document = JSON.parse(documentJson) as z.infer<
        typeof requestSchema.shape.document
      >;
      relation = JSON.parse(relationJson) as z.infer<
        typeof requestSchema.shape.relation
      >;
    } catch (parseError) {
      console.log(parseError);
      return new Response("Invalid JSON format", { status: 400 });
    }

    // Validate the parsed data using the schema
    const result = requestSchema.safeParse({ document, relation, file });
    if (!result.success) {
      return new Response(result.error.message, { status: 400 });
    }

    // Destructure validated data
    const {
      document: validatedDocument,
      relation: validatedRelation,
      file: validatedFile,
    } = result.data;

    const [userId, userIdError] = await getCurrentUserIdAction();
    if (userIdError !== null) return new Response(userIdError, { status: 500 });

    // Save the file and get the path
    const [path, saveError] = await saveDocumentFile(validatedFile);
    if (saveError !== null) return new Response(saveError, { status: 500 });

    // Insert the document along with the relation
    const [documentId, documentInsertError] = await insertDocumentWithRelation(
      {
        name: validatedDocument.name,
        notes: validatedDocument.notes,
        path,
        createdBy: userId,
      },
      validatedRelation as Omit<DocumentRelationsType, "documentId">,
    );

    if (documentInsertError !== null)
      return new Response(documentInsertError, { status: 500 });

    return new Response(JSON.stringify({ documentId }), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Server Error", { status: 500 });
  }
}

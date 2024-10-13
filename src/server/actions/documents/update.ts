"use server";

import type { z } from "zod";
import { getCurrentUserAction } from "@/server/actions/users";
import { documentSchema } from "@/server/db/tables/document/schema";
import { updateDocument } from "@/server/db/tables/document/queries";
import type { ReturnTuple } from "@/utils/type-utils";
import { revalidatePath } from "next/cache";

const updateNameSchema = documentSchema.pick({ name: true });

type UpdateDocumentNameFormType = z.infer<typeof updateNameSchema>;

export const updateDocumentNameAction = async (
  id: number,
  data: UpdateDocumentNameFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateNameSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [currentUser, currentUserError] = await getCurrentUserAction();
  if (currentUserError !== null) return [null, currentUserError];

  if (currentUser.role !== "admin") return [null, "Unauthorized"];

  const [documentId, documentIdError] = await updateDocument(id, {
    name: isValid.data.name,
  });
  if (documentIdError !== null) return [null, documentIdError];
  revalidatePath("/documents")
  revalidatePath("/document")
  return [documentId, null];
};

const updateNotesSchema = documentSchema.pick({ notes: true });

type UpdateDocumentNotesFormType = z.infer<typeof updateNotesSchema>;

export const updateDocumentNotesAction = async (
  id: number,
  data: UpdateDocumentNotesFormType,
): Promise<ReturnTuple<number>> => {
  const isValid = updateNotesSchema.safeParse(data);
  if (!isValid.success) return [null, "Invalid data"];

  const [documentId, documentIdError] = await updateDocument(id, {
    notes: isValid.data.notes,
  });
  if (documentIdError !== null) return [null, documentIdError];
  revalidatePath("/document")
  return [documentId, null];
};

import { z } from "zod";
import { emptyToUndefined } from "../common";
import { notesMaxLength } from "@/data/config";

export const notesFormSchema = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .max(notesMaxLength, {
      message: `Notes must not be longer than ${notesMaxLength} characters`,
    })
    .optional(),
);

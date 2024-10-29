
import { z } from "zod";
import { emptyToUndefined } from "@/utils/common";

export const schema = z
  .object({
    companyName: z.preprocess(emptyToUndefined, z.string()),
    companyAddress: z.preprocess(emptyToUndefined, z.string()),
    companyCountry: z.preprocess(emptyToUndefined, z.string()),
    companyPhoneNmA: z.preprocess(emptyToUndefined, z.string()),
    companyPhoneNmB: z.preprocess(emptyToUndefined, z.string()),
    companyEmail: z.preprocess(emptyToUndefined, z.string().email()),
    offerValidityInDays: z.preprocess(emptyToUndefined, z.string()),
    advancePercentage: z.preprocess(emptyToUndefined, z.string()),
    deliveryPeriod: z.preprocess(emptyToUndefined, z.string()),
  })
  .superRefine((data, ctx) => {
    const { offerValidityInDays, advancePercentage } = data;
    if (isNaN(parseInt(offerValidityInDays))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Offer Validity must be a number",
        path: ["offerValidityInDays"],
      });
      return false;
    }
    if (isNaN(parseInt(advancePercentage))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Advance Percentage must be a number",
        path: ["advancePercentage"],
      });
      return false;
    }
    return true;
  });

export type FormSchemaType = z.infer<typeof schema>;

export const systemDefaultValues: FormSchemaType = {
  companyName: "ACME INC",
  companyAddress: "51 Rosetta st.",
  companyCountry: "Alexandria, Egypt",
  companyPhoneNmA: "+20 123 456 7890",
  companyPhoneNmB: "+20 123 456 7891",
  companyEmail: "sales@acme-inc.com",
  offerValidityInDays: "7",
  advancePercentage: "25",
  deliveryPeriod: "2 - 3 months",
} as const;

export const fields: Array<keyof FormSchemaType> = Array.from(
  Object.keys(systemDefaultValues) as Array<keyof FormSchemaType>,
);

export const getStorageValues = (storage: Storage | null) => {
  const values = systemDefaultValues;
  for (const field of fields) {
    const value = storage?.getItem(field);
    if (value) values[field] = value;
  }
  return values;
};

export const setStorageValues = (storage: Storage | null, values: FormSchemaType) => {
  for (const field of fields) {
    storage?.setItem(field, values[field]);
  }
};

export const getFileName = (response: Response) =>
  response.headers.get("Content-Disposition")?.split("filename=")[1]?.slice(1);

export const createLink = (doc: Document, blob: Blob, fileName: string) => {
  const link = doc.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  link.remove();
};

export const createFormData = (values: {
  data: FormSchemaType;
  projectId: number;
}) => {
  const { data, projectId } = values;
  const formData = new FormData();
  formData.append("id", projectId.toString());
  Array.from(fields).forEach((field) => {
    formData.append(field, data[field]);
  });
  return formData;
};

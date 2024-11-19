"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { addNewContactAction } from "@/server/actions/contacts";

import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { useTranslations } from "next-intl";
import { notesMaxLength } from "@/data/config";
import {
  FieldType,
  FormGenerator,
  emptyToNull,
  emptyToUndefined,
} from "@/components/form-generator";

function NewContactForm({
  id,
  type,
}: {
  id: number;
  type: "supplier" | "client";
}) {
  const t = useTranslations("contact");

  const formData = [
    {
      name: "name",
      label: t("form.contact-name-label"),
      description: t("form.contact-name-description"),
      default: "",
      type: FieldType.Text,
      required: true,
      schema: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.name-required") })
          .min(4, { message: t("schema.name-min-length", { minLength: 4 }) })
          .max(64, {
            message: t("schema.name-max-length", { maxLength: 64 }),
          }),
      ),
    },
    {
      name: "email",
      label: t("form.email-label"),
      description: t("form.email-description"),
      default: "",
      type: FieldType.Text,
      required: false,
      schema: z.preprocess(
        emptyToNull,
        z
          .string()
          .email({ message: t("schema.email-not-valid") })
          .nullable(),
      ),
    },
    {
      name: "phoneNumber",
      label: t("form.phone-number-label"),
      description: t("form.phone-number-description"),
      default: "",
      type: FieldType.Text,
      required: false,
      schema: z.preprocess(
        emptyToNull,
        z
          .string()
          .max(64, {
            message: t("schema.phone-number-max-length", { maxLength: 64 }),
          })
          .nullable(),
      ),
    },
    {
      name: "notes",
      label: t("form.notes-label"),
      description: t("form.notes-description"),
      default: "",
      type: FieldType.Textarea,
      required: false,
      schema: z.preprocess(
        emptyToNull,
        z
          .string()
          .max(notesMaxLength, {
            message: t("schema.notes-max-length", {
              maxLength: notesMaxLength,
            }),
          })
          .nullable(),
      ),
    },
  ] as const;

  const generator = new FormGenerator(formData);

  const defaultValues = generator.defaultValues;
  const schema = z.object(generator.schema).superRefine((data, ctx) => {
    if (!data.phoneNumber && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("schema.email-or-phone-required"),
        path: ["phoneNumber"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("schema.email-or-phone-required"),
        path: ["email"],
      });
      return false;
    }
  });

  type FormSchemaType = z.infer<typeof schema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType) => {
    const ref = type === "supplier" ? { supplierId: id } : { clientId: id };
    try {
      const response = await addNewContactAction(
        {
          ...data,
          ...ref,
        },
        type,
      );
      if (!response) return;
      const [, error] = response;
      if (error !== null) {
        toast.error(error);
        return;
      }
      form.reset();
      toast.success(t("success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormWrapperWithSubmit
        title={t("title")}
        description={t("description")}
        buttonText={t("button-text")}
        dirty={form.formState.isDirty}
        submitting={form.formState.isSubmitting}
      >
        {generator.fields(form)}
      </FormWrapperWithSubmit>
    </form>
  );
}

export default NewContactForm;

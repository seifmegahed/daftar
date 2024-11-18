"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { addNewAddressAction } from "@/server/actions/addresses";

import { countries } from "@/lib/countries";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { emptyToNull, emptyToUndefined } from "@/utils/common";
import { notesMaxLength } from "@/data/config";
import { useTranslations } from "next-intl";
import { FieldType, FormGenerator } from "@/components/form-generator";

function NewAddressForm({
  id,
  type,
}: {
  id: number;
  type: "supplier" | "client";
}) {
  const t = useTranslations("address");

  const formData = [
    {
      name: "name",
      testId: "address-name",
      label: t("form.address-name-label"),
      description: t("form.address-name-description"),
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
      name: "addressLine",
      testId: "address-line",
      label: t("form.address-line-label"),
      description: t("form.address-line-description"),
      default: "",
      type: FieldType.Text,
      required: true,
      schema: z.preprocess(
        emptyToUndefined,
        z
          .string({ required_error: t("schema.address-line-required") })
          .min(5, {
            message: t("schema.address-line-min-length", { minLength: 5 }),
          })
          .max(256, {
            message: t("schema.address-line-max-length", { maxLength: 256 }),
          }),
      ),
    },
    {
      name: "country",
      testId: "country",
      label: t("form.country-label"),
      description: t("form.country-description"),
      selectMessage: t("form.country-select-message"),
      searchMessage: t("form.country-search-message"),
      notFoundMessage: t("form.country-not-found-message"),
      default: undefined,
      type: FieldType.ComboSelect,
      required: true,
      schema: z.string({
        required_error: t("schema.country-required"),
      }),
      options: countries,
    },
    {
      name: "city",
      testId: "city",
      label: t("form.city-label"),
      description: t("form.city-description"),
      default: "",
      type: FieldType.Text,
      required: false,
      schema: z.preprocess(
        emptyToNull,
        z
          .string()
          .max(256, {
            message: t("schema.city-max-length", { maxLength: 256 }),
          })
          .nullable(),
      ),
    },
    {
      name: "notes",
      testId: "notes-field",
      label: t("form.address-notes-label"),
      description: t("form.address-notes-description"),
      type: FieldType.Textarea,
      default: "",
      required: false,
      schema: z.preprocess(
        emptyToNull,
        z
          .string()
          .max(notesMaxLength, {
            message: t("schema.address-notes-max-length", {
              maxLength: notesMaxLength,
            }),
          })
          .nullable(),
      ),
    },
  ] as const;

  const generator = new FormGenerator(formData);

  const schema = z.object(generator.schema);
  const defaultValues = generator.defaultValues;

  type FormSchemaType = z.infer<typeof schema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormSchemaType) => {
    const ref = type === "supplier" ? { supplierId: id } : { clientId: id };

    try {
      const response = await addNewAddressAction(
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
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

export default NewAddressForm;

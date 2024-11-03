"use client";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notesMaxLength } from "@/data/config";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { GeneratedRelationType } from ".";
import Dropzone from "@/components/inputs/drop-zone";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "@/i18n/routing";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { useTranslations } from "next-intl";
import { emptyToUndefined } from "@/utils/common";

function NewDocumentForm({
  generatedRelation,
}: {
  generatedRelation?: GeneratedRelationType;
}) {
  const t = useTranslations("document-form.new-document-form");
  const navigate = useRouter();

  const documentSchema = z.object({
    name: z.preprocess(
      emptyToUndefined,
      z
        .string({
          required_error: t("name-required"),
        })
        .min(4, { message: t("name-min-length", { minLength: 4 }) })
        .max(64, { message: t("name-max-length", { maxLength: 64 }) }),
    ),
    private: z.boolean(),
    notes: z.string().max(notesMaxLength, {
      message: t("notes-max-length", { maxLength: notesMaxLength }),
    }),
    file: z.instanceof(File),
  });

  type FormSchemaType = z.infer<typeof documentSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      private: false,
      notes: "",
      file: undefined,
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    if (generatedRelation) {
      const body = new FormData();
      body.append("file", data.file);
      body.append(
        "document",
        JSON.stringify({
          name: data.name,
          notes: data.notes,
          private: data.private,
        }),
      );
      body.append("relation", JSON.stringify(generatedRelation));
      const response = await fetch("/api/upload-relational-document", {
        method: "POST",
        redirect: "follow",
        body,
      });
      if (!response.ok) toast.error(t("error"));
      else {
        form.reset();
        toast.success(t("success"));
        navigate.replace("documents");
      }
    } else {
      const body = new FormData();
      body.append(
        "document",
        JSON.stringify({ name: data.name, notes: data.notes }),
      );
      body.append("file", data.file);
      const response = await fetch("/api/upload-document", {
        method: "POST",
        redirect: "follow",
        body,
      });
      if (!response.ok) toast.error(t("error"));
      else {
        form.reset();
        toast.success(t("success"));
        navigate.push("/documents");
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormWrapperWithSubmit
          title={t("title")}
          description={t("description")}
          buttonText={t("button-text")}
          submitting={form.formState.isSubmitting}
          dirty={form.formState.isDirty}
        >
          <FormField
            name="file"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <Dropzone
                  onUpload={(file) => field.onChange(file)}
                  file={field.value}
                />
              </FormItem>
            )}
          />
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name-field-label")}</FormLabel>
                <Input {...field} />
                <FormDescription>{t("name-field-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="private"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("private-field-label")}</FormLabel>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
                <FormDescription>
                  {t("private-field-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("notes-field-label")}</FormLabel>
                <Textarea {...field} rows={3} className="resize-none" />
                <FormDescription>{t("notes-field-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewDocumentForm;

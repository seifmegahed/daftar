"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { addNewContactAction } from "@/server/actions/contacts";
import { emptyToUndefined } from "@/utils/common";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormWrapperWithSubmit } from "@/components/form-wrapper";
import { useTranslations } from "next-intl";
import { notesMaxLength } from "@/data/config";

function NewContactForm({
  id,
  type,
}: {
  id: number;
  type: "supplier" | "client";
}) {
  const t = useTranslations("contact");

  const schema = z.object({
    name: z.preprocess(
      emptyToUndefined,
      z
        .string({ required_error: t("schema.name-required") })
        .min(4, { message: t("schema.name-min-length", { minLength: 4 }) })
        .max(64, {
          message: t("schema.name-max-length", { maxLength: 64 }),
        }),
    ),
    phoneNumber: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(64, {
          message: t("schema.phone-number-max-length", { maxLength: 64 }),
        })
        .optional(),
    ),
    email: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .email({ message: t("schema.email-not-valid") })
        .max(64, {
          message: t("schema.email-max-length", { maxLength: 64 }),
        })
        .optional(),
    ),
    notes: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .max(notesMaxLength, {
          message: t("schema.notes-max-length", {
            maxLength: notesMaxLength,
          }),
        })
        .optional(),
    ),
  });

  type FormSchemaType = z.infer<typeof schema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      notes: "",
    },
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Form {...form}>
        <FormWrapperWithSubmit
          title={t("title")}
          description={t("description")}
          buttonText={t("button-text")}
          dirty={form.formState.isDirty}
          submitting={form.formState.isSubmitting}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.contact-name-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.contact-name-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.email-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.email-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.phone-number-label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {t("form.phone-number-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.notes-label")}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" rows={4} />
                </FormControl>
                <FormDescription>
                  {t("form.notes-description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapperWithSubmit>
      </Form>
    </form>
  );
}

export default NewContactForm;
